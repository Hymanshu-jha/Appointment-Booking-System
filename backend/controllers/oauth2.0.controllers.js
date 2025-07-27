import { google } from 'googleapis';
import crypto from 'crypto';
import User from '../db/schema/users.models.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jsonwebtoken/jsonwebtoken.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const VITE_BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:5173';

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Scopes just for basic login (email, profile)
const scopes = ['openid', 'email', 'profile'];

// === Step 1: Redirect user to Google's consent page ===
export const googleAuthPageRedirector = (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.state = state;

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    state: state,
    prompt: 'select_account' // ← ADD THIS LINE
  });

  res.json({
    message: `successfully created authorizationUrl ${authorizationUrl}`,
    url: authorizationUrl
  });
};




// === Step 2: Handle callback after user consents ===
export const consentPageCallbackHandler = async (req, res) => {
  const code = req.query.code;
  const returnedState = req.query.state;

  if (returnedState !== req.session.state) {
    return res.status(400).send('Invalid state parameter (possible CSRF).');
  }

  try {
    // Exchange code for access tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user profile from Google
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    const { data } = await oauth2.userinfo.get();
    const { email, name, picture } = data;

    if (!email) {
      return res.status(400).send('Email not available from Google');
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        userName: name,
        isVerified: true,
        picture
      });
    }

    // Generate JWT tokens
    const payload = {
      email,
      userName: name,
      _id: user._id,
    };

    const accessToken = generateAccessToken(payload, '1h');
    const refreshToken = generateRefreshToken({ email }, '7d');

    // Save refresh token to DB (corrected update query)
    await User.updateOne({ email }, { refreshToken });

    // Secure cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true if deployed
      sameSite: 'None', // Allow cross-site cookies
    };

    // Set cookies
    res.cookie('accessToken', accessToken, {...cookieOptions, 
      maxAge: 3600,
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    
    return res.redirect(`${VITE_BASE_URL}/services`);

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Authentication failed.');
  }
};



export const getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const existsUser = await User.findById(_id);

    if (!existsUser) {
      return res.status(404).json({
        type: 'error',
        message: 'User not found'
      });
    }

    if (!existsUser.isVerified) {
      return res.status(403).json({
        type: 'error',
        message: 'User is not verified'
      });
    }

    const { email, userName, picture } = existsUser;




    return res.status(200).json({
      type: 'success',
      user: {
        _id,
        email,
        userName,
        picture
      }
    });

  } catch (error) {
    console.log('Error while calling getMe for oauth verified user:', error);
    next(error);
  }
};
