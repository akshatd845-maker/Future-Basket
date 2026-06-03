const express = require("express");

const { protect, admin } = require("../middleware/authMiddleware");

const {
  getDashboardSummary,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  adminUpdateOrderStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const router = express.Router();

// Apply auth + admin to all routes below
router.use(protect, admin);

// Dashboard
router.get("/dashboard/summary", getDashboardSummary);

// Products
router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", adminUpdateOrderStatus);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;

