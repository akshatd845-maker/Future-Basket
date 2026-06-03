const express = require("express");

const { protect, admin } = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

// Backward compatible route (older clients)
router.delete("/:id", protect, cancelOrder);

// Professional cancel route (new)
router.patch("/:id/cancel", protect, cancelOrder);

module.exports = router;


