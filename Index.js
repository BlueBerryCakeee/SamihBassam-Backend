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

app.use(cors({
  origin: ["http://localhost:5173", "https://os.netlabdte.com"], // Add your Vite dev server URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/store", storeRoutes);
app.use("/user", userRoutes);
app.use("/item", itemRoutes);
app.use("/transaction", transactionRoutes);
app.use("/cart", cartRoute);
app.use("/checkout", checkoutRoutes);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
