const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Validation rules
const registerValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidators, register);
router.post("/login", loginValidators, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/refresh", refreshToken);

module.exports = router;