require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
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