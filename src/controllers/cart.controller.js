const baseResponse = require("../utils/baseResponse.util");
const cartRepository = require("../repositories/cart.repositories");

exports.addToCart = async (req, res) => {
  const { user_id, item_id, quantity } = req.body;

  if (!user_id || !item_id) {
    return baseResponse(res, false, 400, "User ID and Item ID are required", null);
  }

  try {
    const cartItem = await cartRepository.addToCart(user_id, item_id, quantity || 1);
    return baseResponse(res, true, 201, "Item added to cart successfully", cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return baseResponse(res, false, 500, "Failed to add item to cart", error.message);
  }
};

exports.getCartItems = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return baseResponse(res, false, 400, "User ID is required", null);
  }

  try {
    const cartItems = await cartRepository.getCartItems(user_id);
    return baseResponse(res, true, 200, "Cart items retrieved successfully", cartItems);
  } catch (error) {
    console.error("Error getting cart items:", error);
    return baseResponse(res, false, 500, "Failed to retrieve cart items", error.message);
  }
};

exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return baseResponse(res, false, 400, "Cart item ID is required", null);
  }

  try {
    const removedItem = await cartRepository.removeFromCart(id);
    if (!removedItem) {
      return baseResponse(res, false, 404, "Cart item not found", null);
    }
    return baseResponse(res, true, 200, "Item removed from cart successfully", removedItem);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return baseResponse(res, false, 500, "Failed to remove item from cart", error.message);
  }
};

exports.updateQuantity = async (req, res) => {
  const { id, quantity } = req.body;

  if (!id || quantity === undefined) {
    return baseResponse(res, false, 400, "Cart item ID and quantity are required", null);
  }

  try {
    const updatedItem = await cartRepository.updateQuantity(id, quantity);
    if (!updatedItem) {
      return baseResponse(res, false, 404, "Cart item not found", null);
    }
    return baseResponse(res, true, 200, "Item quantity updated successfully", updatedItem);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return baseResponse(res, false, 500, "Failed to update item quantity", error.message);
  }
};