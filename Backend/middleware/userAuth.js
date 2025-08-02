import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token in header" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};


export const verifyAdmin = [
  userAuth,
  (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
  },
];

export const verifyUser = [
  userAuth,
  (req, res, next) => {

    const userId = req.user.id;

    if (userId === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "You are not authorized!" });
    }
  },
];
