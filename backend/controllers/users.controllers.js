import bcrypt from 'bcryptjs';
import User from "../db/schema/users.models.js";
import { addJobToBullmq } from '../utils/bullmq/producer.bullmq.js';
import { generateAccessToken, generateRefreshToken , verifyToken } from "../utils/jsonwebtoken/jsonwebtoken.js";

import dotenv from 'dotenv';
dotenv.config();


export const signup = async (req, res, next) => {
  try {
    const {
      userName,
      password,
      email,
      phone,
    } = req.body;

    // Check required fields
    if (!userName || !password || !email) {
      return res.status(400).json({
        type: 'error',
        message: "Missing required fields: userName, password, or email.",
      });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`User is already registered`);
      return res.status(400).json({
        type: 'error',
        message: 'User already exists' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      password: hashedPassword,
      email,
      phone,
      isVerified: false,
    });

    const saveResponse = await newUser.save();

    if (!saveResponse) {
      console.log(`Error while saving user`);
      return res.status(500).json({
        type: 'error',
        message: `Error while saving user` 
      });
    }

    // generate token (NO password in token!)
    const token = generateAccessToken(
      {
        email: saveResponse.email,
        userName: saveResponse.userName,
        _id: saveResponse._id,
      },
      '1h'
    );

    const jobInfo = {
        name: 'verifyEmail',
        data: {
         to: email,
         token: token,
         username: userName
        }
    }

    try {
      const verificationMailSentStatus = await addJobToBullmq(jobInfo);

      if (!verificationMailSentStatus) {
        return res.status(500).json({
          type: 'error',
          message: `Error while sending verification mail`,
        });
      }
    } catch (error) {
      console.error(`Error adding verification email job`, error);
      return res.status(500).json({
        type: 'error',
        message: `Error while scheduling verification email`,
      });
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("token", token, { ...options, maxAge: 5 * 60 * 1000 }); 

    return res.status(200).json({
      type: 'success',
      message: `we've sent u a verification mail, please kindly check you email.`,
    });

  } catch (error) {
    console.log(`Error occurred while signing up`, error);
    next(error);
  }
};






export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log(`Email and/or password missing`);
      return res.status(400).json({
        message: `Email and/or password missing`,
      });
    }

    const userExists = await User.findOne({ email });
    if (!userExists || !userExists.isVerified) {
      console.log(`User does not exist or is not verified`);
      return res.status(401).json({
        message: `User does not exist or is not verified`,
      });
    }

    const isMatch = await bcrypt.compare(password, userExists?.password.toString());
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      email: userExists.email,
      userName: userExists.userName, // Make sure `userName` exists in your User model
      _id: userExists._id,
    };

    const accessToken = generateAccessToken(payload, "1h");
    const refreshToken = generateRefreshToken({ email: userExists.email }, '7d');

    try {
      userExists.refreshToken = refreshToken;
      await userExists.save();
    } catch (error) {
      return res.status(500).json({ message: `Could not save refreshToken to the database` });
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, { ...options, maxAge: 1000 * 60 * 60 }); // 1 hour
    res.cookie("refreshToken", refreshToken, { ...options, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

    const userData = userExists.toObject();
    delete userData.password;
    delete userData.refreshToken;

    return res.status(200).json({
      message: `Login successful`,
      user: userData,
      success: true
    });
  } catch (error) {
    console.log(`Error while logging in from controllers`, error);
    next(error);
  }
};







export const logout = async (req, res, next) => {
  try {
    const { email } = req.user; // fixed destructure

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clear refreshToken in DB
    await User.updateOne(
      { email },
      { $unset: { refreshToken: "" } }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    console.log(`logout successfully`);

    return res.status(200).json({
      message: `logout successfully`,
      success: true
    });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error);
  }
};





export const mailVerify = async (req, res, next) => {
  try {
    const token = req?.query?.token;

    if (!token) {
      console.log(`Verify token missing`);
      return res.status(400).json({
        success: false,
        message: "Verification token missing",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      console.log(`Invalid or expired verification token`);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    const { email } = decoded;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      console.log(`User does not exist`);
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (userExists.isVerified) {
      return res.status(200).json({
        success: true,
        message: `Email already verified for ${email}`,
      });
    }

    const verification = await userExists.updateOne({ isVerified: true });

    if (!verification) {
      console.log(`Could not update isVerified field`);
      return res.status(500).json({
        success: false,
        message: "Could not verify user email",
      });
    }

    console.log(`Email verification successful for ${email}`);

    return res.status(200).json({
      success: true,
      message: `Email verification successful for ${email}`,
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    next(error);
  }
};
