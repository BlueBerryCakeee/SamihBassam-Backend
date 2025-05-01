require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const storeRoutes = require("./src/routes/store.route");
const userRoutes = require("./src/routes/user.route");
const itemRoutes = require("./src/routes/item.route");
const transactionRoutes = require("./src/routes/transaction.route");
const cartRoute = require("./src/routes/cart.route");
const checkoutRoutes = require("./src/routes/checkout.route");

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://os.netlabdte.com",
  "https://samihbassam-frontend.vercel.app",
  "https://samihbassam-backend.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked:', origin);
      callback(null, true); // Allow all origins in production
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/store", storeRoutes);
app.use("/user", userRoutes);
app.use("/item", itemRoutes);
app.use("/transaction", transactionRoutes);
app.use("/cart", cartRoute);
app.use("/checkout", checkoutRoutes);

// Root endpoint untuk health check
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;

// Buat file baru: api/index.js
const app = require('../Index');
module.exports = app;
