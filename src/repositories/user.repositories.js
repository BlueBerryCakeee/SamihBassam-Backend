const { pool } = require("../database/pg.database");
const bcrypt = require("bcryptjs");

// REGISTER
exports.registerUser = async (name, email, password) => {
  try {

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// LOGIN
exports.loginUser = async (email, password) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length === 0) {
    console.log("❌ Email tidak ditemukan:", email);
    return null; // Email tidak ditemukan
  }

  const user = result.rows[0];

  // 🔹 Debugging untuk memastikan data benar
  console.log("🔹 User ditemukan:", user.email);
  console.log("🔹 Hash password dari database:", user.password);
  console.log("🔹 Password yang dimasukkan:", password);

  console.log("✅ Login berhasil");
  return user;
};



// GET USER BY EMAIL
exports.getUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// UPDATE
exports.updateUser = async (id, name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
    [name, email, hashedPassword, id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};


// DELETE
exports.deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

// GET USER BY ID
exports.getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

// TOP UP
exports.topUpUser = async (id, amount) => {
  try {
    const result = await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [amount, id]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Tambahkan function ini di user repository
exports.updateBalance = async (id, newBalance, client = pool) => {
  try {
    const result = await client.query(
      `UPDATE users SET balance = $1 WHERE id = $2 RETURNING *`,
      [newBalance, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateBalance:", error);
    throw error;
  }
};
