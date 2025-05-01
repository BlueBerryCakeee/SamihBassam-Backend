const userRepository = require("../repositories/user.repositories");
const baseResponse = require("../utils/baseResponse.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

exports.registerUser = async (req, res) => {
  console.log("Received Query Params:", req.query);

  let { name, email, password } = req.query;
  name = name?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!name || !email || !password) {
    return baseResponse(res, false, 400, "Name, Email, and Password are required", null);
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters and contain letters and numbers", null);
  }

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 409, "Email is already registered", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.registerUser(name, email, hashedPassword);

    return baseResponse(res, true, 201, "User registered successfully", user);
  } catch (error) {
    console.error("Register Error:", error);
    return baseResponse(res, false, 500, "Failed to register user", error.message);
  }
};


exports.loginUser = async (req, res) => {
  console.log("Received Query Params:", req.query);

  const { email, password } = req.query;
  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and Password are required", null);
  }

  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 401, "Invalid email or password", null);
    }

    // Debugging log sebelum bcrypt.compare()
    console.log("🔹 User ditemukan:", user.email);
    console.log("🔹 Hash password dari database:", user.password);
    console.log("🔹 Password yang dimasukkan:", password);

    // Cek bcrypt.compare()
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 Hasil bcrypt.compare():", passwordMatch);

    if (!passwordMatch) {
      return baseResponse(res, false, 401, "Invalid email or password", null);
    }

    // Hapus password sebelum mengirim response
    const { password: _, ...userWithoutPassword } = user;
    return baseResponse(res, true, 200, "Login success", userWithoutPassword);
  } catch (error) {
    return baseResponse(res, false, 500, "Failed to login user", error.message);
  }
};


exports.updateUser = async (req, res) => {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return baseResponse(res, false, 400, "ID, Name, Email, and Password are required", null);
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters and contain letters and numbers", null);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.updateUser(id, name, email, hashedPassword);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User updated successfully", user);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to update user", error.message);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return baseResponse(res, false, 400, "ID is required", null);
  }

  try {
    const result = await userRepository.deleteUser(id);
    if (!result) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User deleted successfully", result);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to delete user", error.message);
  }
};

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
  
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, message: "User retrieved successfully", data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve user", error: error.message });
    }
  };
  
  exports.topUpUser = async (req, res) => {
  console.log("Received Query Params:", req.query);

  const { id, amount } = req.query;

  // Validasi input
  if (!id || !amount || isNaN(amount)) {
    return baseResponse(res, false, 400, "ID and a valid Amount are required", null);
  }

  const topUpAmount = parseFloat(amount);
  if (topUpAmount <= 0) {
    return baseResponse(res, false, 400, "Amount must be larger than 0", null);
  }

  try {
    // Cek apakah user ada di database
    const user = await userRepository.getUserById(id);
    if (!user) {
      console.log("User tidak ditemukan:", id);
      return baseResponse(res, false, 404, "User not found", null);
    }

    // Lakukan top-up saldo di database
    const updatedUser = await userRepository.topUpUser(id, topUpAmount);
    
    // Hapus password dari response agar tidak ditampilkan
    const { password, ...userWithoutPassword } = updatedUser;

    return baseResponse(res, true, 200, "Top up successful", userWithoutPassword);
  } catch (error) {
    console.error("Top Up Error:", error);
    return baseResponse(res, false, 500, "Failed to top up balance", error.message);
  }
};
