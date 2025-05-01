require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Penting untuk Neon di Vercel
  }
});

// Test koneksi saat startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

module.exports = { pool };