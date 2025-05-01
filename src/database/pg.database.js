require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Untuk koneksi ke Neon
  },
  max: 10, // Batasi jumlah koneksi maksimum
  idleTimeoutMillis: 30000
});

// Menangani error koneksi
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

pool.connect()
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Failed to connect to database:", error.message));

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error("Failed to execute query:", error.message);
    throw error;
  }
};

module.exports = { pool, query };