/**
 * Seed script for MongoDB.
 * Run (from server folder): node seed.js
 */

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const dns = require("dns");

// Fix DNS for Node.js
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Product = require("./models/Product");

// Using picsum.photos - reliable placeholder images
const PRODUCTS = [
  {
    title: "Wireless Bluetooth Headphones",
    price: 59.99,
    image:
      "https://picsum.photos/seed/headphones/800/600",
    description:
      "Comfortable over-ear wireless headphones with deep bass and clear calls.",
    category: "Electronics",
  },
  {
    title: "Smartwatch Series 6",
    price: 129.0,
    image:
      "https://picsum.photos/seed/smartwatch/800/600",
    description:
      "Track your workouts, monitor heart rate, and stay connected with notifications.",
    category: "Wearables",
  },
  {
    title: "4K Ultra HD Monitor",
    price: 299.99,
    image:
      "https://picsum.photos/seed/monitor/800/600",
    description:
      "Crisp 4K visuals with vibrant colors for productivity and entertainment.",
    category: "Computers",
  },
  {
    title: "Ergonomic Office Chair",
    price: 189.5,
    image:
      "https://picsum.photos/seed/chair/800/600",
    description:
      "Supportive lumbar design and breathable mesh to keep you comfortable all day.",
    category: "Home & Office",
  },
  {
    title: "Stainless Steel Water Bottle (1L)",
    price: 22.75,
    image:
      "https://picsum.photos/seed/bottle/800/600",
    description:
      "Insulated bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
    category: "Accessories",
  },
  {
    title: "Organic Cotton T-Shirt",
    price: 18.99,
    image:
      "https://picsum.photos/seed/tshirt/800/600",
    description:
      "Soft, breathable, and durable everyday t-shirt made from organic cotton.",
    category: "Fashion",
  },
  {
    title: "Leather Wallet (Bifold)",
    price: 35.0,
    image:
      "https://picsum.photos/seed/wallet/800/600",
    description:
      "Slim bifold wallet with multiple card slots and a premium leather finish.",
    category: "Fashion",
  },
  {
    title: "Ceramic Coffee Mug (Set of 2)",
    price: 24.49,
    image:
      "https://picsum.photos/seed/mug/800/600",
    description:
      "Heat-retaining ceramic mugs—perfect for mornings, gifting, and cozy days.",
    category: "Kitchen",
  },
  {
    title: "Non-stick Cookware Pan (28cm)",
    price: 44.25,
    image:
      "https://picsum.photos/seed/pan/800/600",
    description:
      "Even heat distribution with a durable non-stick surface for everyday cooking.",
    category: "Kitchen",
  },
  {
    title: "Noise-Canceling Earbuds",
    price: 74.99,
    image:
      "https://picsum.photos/seed/earbuds/800/600",
    description:
      "Active noise cancellation with crisp audio and a secure, lightweight fit.",
    category: "Electronics",
  },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing MONGO_URI in environment. Ensure it is set in your .env file."
    );
  }

  const connection = await mongoose.connect(mongoUri);

  try {
    await Product.deleteMany({});

    await Product.insertMany(PRODUCTS);

    console.log(`✅ Seeded ${PRODUCTS.length} products`);
  } finally {
    await connection.connection.close();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });