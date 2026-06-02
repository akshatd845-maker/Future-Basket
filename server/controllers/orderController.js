const mongoose = require("mongoose");

const Order = require("../models/Order");

const isValidStatus = (status) => {
  return ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status);
};

const computePricing = ({ itemsPrice, shippingPrice, taxPrice }) => {
  const items = Number(itemsPrice);
  const shipping = Number(shippingPrice);
  const tax = Number(taxPrice);
  if (![items, shipping, tax].every((n) => Number.isFinite(n) && n >= 0)) {
    throw new Error("Invalid pricing values");
  }
  return {
    itemsPrice: items,
    shippingPrice: shipping,
    taxPrice: tax,
    totalPrice: items + shipping + tax,
  };
};

const getShippingFromBody = (body) => {
  const {
    fullName,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
  } = body || {};

  const required = [
    ["fullName", fullName],
    ["phone", phone],
    ["address", address],
    ["city", city],
    ["state", state],
    ["postalCode", postalCode],
    ["country", country],
  ];

  for (const [key, value] of required) {
    if (!value || String(value).trim().length === 0) {
      const err = new Error(`Shipping address field '${key}' is required`);
      err.statusCode = 400;
      throw err;
    }
  }

  return {
    fullName: String(fullName).trim(),
    phone: String(phone).trim(),
    address: String(address).trim(),
    city: String(city).trim(),
    state: String(state).trim(),
    postalCode: String(postalCode).trim(),
    country: String(country).trim(),
  };
};

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body || {};

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "orderItems is required",
      });
    }

    const normalizedOrderItems = orderItems.map((item) => {
      const productId = item?.product;
      const name = item?.name;
      const quantity = Number(item?.quantity);
      const price = Number(item?.price);
      const image = item?.image;

      if (!productId || !mongoose.Types.ObjectId.isValid(String(productId))) {
        throw Object.assign(new Error("Invalid product id in orderItems"), { statusCode: 400 });
      }
      if (!name || String(name).trim().length === 0) {
        throw Object.assign(new Error("Product name is required in orderItems"), { statusCode: 400 });
      }
      if (!Number.isFinite(quantity) || quantity < 1) {
        throw Object.assign(new Error("Invalid quantity in orderItems"), { statusCode: 400 });
      }
      if (!Number.isFinite(price) || price < 0) {
        throw Object.assign(new Error("Invalid price in orderItems"), { statusCode: 400 });
      }
      if (!image || String(image).trim().length === 0) {
        throw Object.assign(new Error("Product image is required in orderItems"), { statusCode: 400 });
      }

      return {
        product: String(productId),
        name: String(name),
        quantity,
        price,
        image: String(image),
      };
    });

    const computedItemsPrice = normalizedOrderItems.reduce((sum, oi) => sum + oi.price * oi.quantity, 0);
    const computedShippingPrice = computedItemsPrice >= 1000 ? 0 : 99;
    const computedTaxPrice = computedItemsPrice * 0.18;

    const pricing = computePricing({
      itemsPrice: computedItemsPrice,
      shippingPrice: computedShippingPrice,
      taxPrice: computedTaxPrice,
    });

    const shipping = getShippingFromBody(shippingAddress);

    if (!paymentMethod || !["card", "cod"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod must be 'card' or 'cod'",
      });
    }

    const order = await Order.create({
      user: userId,
      orderItems: normalizedOrderItems,
      shippingAddress: shipping,
      paymentMethod,
      ...pricing,
      orderStatus: "Pending",
      isPaid: paymentMethod === "card" ? false : false,
      paidAt: undefined,
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const { id } = req.params;
    const { orderStatus } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }
    if (!isValidStatus(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid orderStatus",
      });
    }

    // Route-level middleware enforces admin access.
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;

    // Paid/shipped/delivered timestamps (optional)
    if (orderStatus === "Processing") {
      // keep isPaid as is
    }

    if (orderStatus === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orders/:id (Cancel)
exports.cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

