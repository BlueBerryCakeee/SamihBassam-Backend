const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/add", cartController.addToCart);
router.get("/:user_id", cartController.getCartItems);
router.delete("/:id", cartController.removeFromCart);
router.put("/quantity", cartController.updateQuantity);

module.exports = router;