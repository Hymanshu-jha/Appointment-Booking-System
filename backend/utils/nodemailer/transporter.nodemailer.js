import nodemailer from "nodemailer";
import generateVerificationEmail from "./verificationMailTemplate.js";

const VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:5001/api/v1';

import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === "production" 
    ? ".env.production" 
    : ".env.local"
});

const sendVerificationMail = async ({ to, token, username }) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  transport.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to take messages");
  }
});

  const verificationLink = `${VITE_API_URL}/user/mailverify?token=${token}`;

  const html = generateVerificationEmail({
    username,
    verificationLink,
  });

  const info = await transport.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject: "Verification Mail",
    html,
  });

  console.log("Email sent:", info.response);
};

export default sendVerificationMail;
