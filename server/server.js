const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const { connectDB } = require("./config/db");
const { validateEnv } = require("./config/validateEnv");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middleware/errorMiddleware");


const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://futurebaskett.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl) or matching allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Response logging middleware
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    console.log(`[Response] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
    return oldJson.call(this, data);
  };
  next();
});


// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payment", paymentRoutes);

// Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err.message);
    process.exit(1);
  }
};

startServer();


