const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// ENDPOINTS USER
router.post("/register", userController.registerUser); // Register user
router.post("/login", userController.loginUser); // Login user
router.put("/", userController.updateUser); // Update user
router.get("/email/:email", userController.getUserByEmail); // Get user by email
router.delete("/:id", userController.deleteUser); // Delete user
router.post("/topUP", userController.topUpUser); //

module.exports = router;