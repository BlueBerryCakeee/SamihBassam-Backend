const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const storeRoutes = require("./src/routes/store.route");
const userRoutes = require("./src/routes/user.route");
const itemRoutes = require("./src/routes/item.route");
const transactionRoutes = require("./src/routes/transaction.route");
const cartRoute = require("./src/routes/cart.route");
const checkoutRoutes = require("./src/routes/checkout.route");

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      "http://localhost:5173",
      "https://os.netlabdte.com",
      "https://samihbassam-frontend.vercel.app" // Tambahkan URL frontend Vercel
    ];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tambahkan prefix /api untuk Vercel
const apiPrefix = process.env.VERCEL ? '/api' : '';

app.use(`${apiPrefix}/store`, storeRoutes);
app.use(`${apiPrefix}/user`, userRoutes);
app.use(`${apiPrefix}/item`, itemRoutes);
app.use(`${apiPrefix}/transaction`, transactionRoutes);
app.use(`${apiPrefix}/cart`, cartRoute);
app.use(`${apiPrefix}/checkout`, checkoutRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Jalankan server secara normal di development, tidak di Vercel
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export app untuk serverless functions di Vercel
module.exports = app;
