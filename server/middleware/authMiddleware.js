const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let accessToken;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith("bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }
  // Check for token in cookie
  else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Admin authorization
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

module.exports = { protect, admin };