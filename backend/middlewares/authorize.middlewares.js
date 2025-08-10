import User from "../db/schema/users.models.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jsonwebtoken/jsonwebtoken.js";

const authorize = async (req, res, next) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    console.log(`entered auth middleware`);

    const headerAuth = req.get("Authorization");
    const accessTokenReceived =
      req.cookies.accessToken ||
      (headerAuth && headerAuth.startsWith("Bearer ")
        ? headerAuth.replace("Bearer ", "")
        : null);

    let decoded;

    try {
      decoded = verifyToken(accessTokenReceived);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        decoded = null;
      } else {
        return res.status(401).json({ message: "Invalid token." });
      }
    }

    if (decoded) {
      const user = await User.findOne({ email: decoded.email }).select(
        "-password"
      );
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }
      req.user = user;
      console.log(`auth middleware executed perfectly`);
      return next();
    }

    const refreshTokenReceived = req.cookies.refreshToken;
    if (!refreshTokenReceived) {
      return res
        .status(401)
        .json({ message: "Access expired. Refresh token missing." });
    }

    let refreshDecoded;
    try {
      refreshDecoded = verifyToken(refreshTokenReceived);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }

    const user = await User.findOne({ email: refreshDecoded.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const newAccessToken = generateAccessToken(
      { email: user.email, _id: user._id, userName: user.userName },
      "1h"
    );

    const newRefreshToken = generateRefreshToken(
      { email: user.email },
      "7d"
    );

    // Update refresh token in DB if desired
    // user.refreshToken = newRefreshToken;
    // await user.save();

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.user = user;
    console.log(`auth middleware executed perfectly`);
    next();
  } catch (error) {
    console.error(`Error while authorizing:`, error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default authorize;
