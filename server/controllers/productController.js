const Product = require("../models/Product");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, price, image, description, category } = req.body;

    const product = await Product.create({
      title,
      price,
      image,
      description,
      category,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};


