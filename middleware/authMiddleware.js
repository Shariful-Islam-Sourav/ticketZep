import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from DB (exclude password)
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  // No token
  if (!token) {
    return res.status(401).json({
      message: "No token, not authorized",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
};