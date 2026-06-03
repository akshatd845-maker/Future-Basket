const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

// Helper to initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.isPaid) {
      return res.status(400).json({ success: false, message: "Order is already paid" });
    }

    const instance = getRazorpayInstance();
    const options = {
      amount: Math.round(order.totalPrice * 100), // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await instance.orders.create(options);

    // Save Razorpay order ID to our order document
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Cryptographic validation using HMAC SHA256 signature match
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Mark as paid
      order.isPaid = true;
      order.paidAt = new Date();
      order.razorpayPaymentId = razorpay_payment_id;
      order.paymentResult = {
        id: razorpay_payment_id,
        status: "success",
        email_address: req.user?.email,
      };

      // Progress status to Processing
      if (order.orderStatus === "Pending") {
        order.orderStatus = "Processing";
      }

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature verification failed",
      });
    }
  } catch (err) {
    next(err);
  }
};
