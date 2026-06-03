const mongoose = require("mongoose");

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id));

const getDashboardSummary = async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueAgg] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({}),
      Order.aggregate([
        {
          $match: {
            // treat paid orders as revenue
            isPaid: true,
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalPrice" },
          },
        },
      ]),
    ]);

    const revenueSummary = revenueAgg?.[0]?.revenue ?? 0;

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        revenueSummary,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PRODUCTS (Admin)
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { title, price, image, images, description, category } = req.body || {};

    if (!title || String(title).trim().length === 0) {
      return res.status(400).json({ success: false, message: "title is required" });
    }
    if (!Number.isFinite(Number(price))) {
      return res.status(400).json({ success: false, message: "price must be a number" });
    }
    if (!description || String(description).trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "description is required" });
    }
    if (!category || String(category).trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "category is required" });
    }

    const normalizedImages = Array.isArray(images)
      ? images
      : images
        ? [images]
        : undefined;

    // Backward compatibility: allow legacy `image` OR new `images[]`
    const resolvedImages = (normalizedImages && normalizedImages.length
      ? normalizedImages
      : [image]).filter((u) => u && String(u).trim().length > 0);

    if (!resolvedImages.length) {
      return res.status(400).json({ success: false, message: "images are required" });
    }

    const product = await Product.create({
      title: String(title).trim(),
      price: Number(price),
      images: resolvedImages.map((u) => String(u)),
      // keep legacy field synced
      image: String(resolvedImages[0]),
      description: String(description).trim(),
      category: String(category).trim(),
    });

    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const { title, price, image, images, description, category } = req.body || {};

    const normalizedImages = Array.isArray(images)
      ? images
      : images
        ? [images]
        : undefined;

    // Backward compatibility: allow legacy `image` OR new `images[]`
    const resolvedImages = (normalizedImages && normalizedImages.length
      ? normalizedImages
      : [image]).filter((u) => u && String(u).trim().length > 0);

    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (price !== undefined) updates.price = Number(price);
    if (image !== undefined) updates.image = String(image);
    if (description !== undefined) updates.description = String(description).trim();
    if (category !== undefined) updates.category = String(category).trim();

    // minimal validation when values provided
    if (updates.title !== undefined && updates.title.length === 0) {
      return res.status(400).json({ success: false, message: "title cannot be empty" });
    }
    if (updates.price !== undefined && !Number.isFinite(updates.price)) {
      return res.status(400).json({ success: false, message: "price must be a number" });
    }
    if (updates.description !== undefined && updates.description.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "description cannot be empty" });
    }
    if (updates.category !== undefined && updates.category.length === 0) {
      return res.status(400).json({ success: false, message: "category cannot be empty" });
    }
    if (updates.image !== undefined && updates.image.length === 0) {
      return res.status(400).json({ success: false, message: "image cannot be empty" });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: { deletedId: deleted._id } });
  } catch (err) {
    next(err);
  }
};

// ORDERS (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    // simple optional filters
    const { orderStatus, paymentMethod, isPaid } = req.query || {};

    const query = {};
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (isPaid !== undefined) query.isPaid = isPaid === "true";

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name email role" });

    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body || {};

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid orderStatus" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// USERS (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("_id name email avatar role createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "role must be either 'user' or 'admin'",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("_id name email avatar role");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: { deletedId: deleted._id } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};

