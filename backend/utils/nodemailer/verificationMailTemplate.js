function generateVerificationEmail({ username, verificationLink }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email - BookMate</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', Arial, sans-serif;
          background-color: #0f172a;
          color: #e2e8f0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1e293b;
          border-radius: 8px;
          padding: 40px 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 28px;
          color: #38bdf8;
          margin: 0;
        }
        .content {
          text-align: center;
        }
        .content h2 {
          font-size: 22px;
          margin: 10px 0 20px;
          color: #f1f5f9;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0 0 30px;
        }
        .btn {
          display: inline-block;
          background-color: #38bdf8;
          color: #0f172a;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 6px;
          font-weight: 600;
          transition: background-color 0.3s ease;
          font-size: 16px;
        }
        .btn:hover {
          background-color: #0ea5e9;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #64748b;
        }
        .footer a {
          color: #38bdf8;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AppointMe!!</h1>
        </div>
        <div class="content">
          <h2>Hello ${username} 👋</h2>
          <p>
            Thank you for signing up with BookMate! To confirm your email and get started booking appointments seamlessly, please verify your email address below.
          </p>
          <a href="${verificationLink}" class="btn">Verify My Email</a>
          <p style="margin-top: 30px; font-size: 14px; color: #94a3b8;">
            This link will expire in 24 hours for your security.
          </p>
          <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">
            Didn’t sign up for BookMate? You can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} BookMate. All rights reserved.<br>
          Need help? Contact us at <a href="mailto:support@bookmate.com">support@bookmate.com</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default generateVerificationEmail;
