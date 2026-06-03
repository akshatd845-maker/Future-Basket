const express = require("express");
const multer = require("multer");

const { protect, admin } = require("../middleware/authMiddleware");
const { uploadProductImages } = require("../controllers/uploadController");

const router = express.Router();

// In-memory uploads (small/medium images). For production, consider size limits + streaming.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
});

// Admin-only image upload
router.post(
  "/images",
  protect,
  admin,
  upload.array("images", 10),
  uploadProductImages
);

module.exports = router;

