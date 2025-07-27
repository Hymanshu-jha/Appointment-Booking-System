// jwt.sign(payload, secretOrPrivateKey, options);

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';

export function generateAccessToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn,
  });
}


export function generateRefreshToken(payload, expiresIn = '7d') {
  return jwt.sign(payload , JWT_SECRET_KEY, {
    expiresIn
  });
}


export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY, {
    });
  } catch (err) {
    return null;
  }
}



