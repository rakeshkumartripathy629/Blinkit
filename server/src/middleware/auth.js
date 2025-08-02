import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.token;
    const authHeader = req.headers?.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: token missing",
        error: true,
        success: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyErr) {
      console.error("JWT verification error:", verifyErr);
      return res.status(401).json({
        message: "Token verification failed",
        error: true,
        success: false,
      });
    }

    if (!decoded?._id) {
      return res.status(401).json({
        message: "Invalid token payload",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (err) {
    console.error("protectRoute unexpected error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export default protectRoute;
