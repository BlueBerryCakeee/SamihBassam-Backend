const { pool } = require("../database/pg.database");

exports.addToCart = async (user_id, item_id, quantity = 1) => {
  try {
    // Cek apakah item sudah ada di cart
    const existingItem = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND item_id = $2`,
      [user_id, item_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity jika item sudah ada
      const result = await pool.query(
        `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND item_id = $3 RETURNING *`,
        [quantity, user_id, item_id]
      );
      return result.rows[0];
    } else {
      // Tambahkan item baru ke cart
      const result = await pool.query(
        `INSERT INTO cart (user_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
        [user_id, item_id, quantity]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

exports.getCartItems = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.quantity, i.id as item_id, i.name, i.price, i.image_url, i.stock 
       FROM cart c 
       JOIN items i ON c.item_id = i.id 
       WHERE c.user_id = $1`,
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

exports.removeFromCart = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM cart WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error;
  }
};

exports.updateQuantity = async (id, quantity) => {
  try {
    const result = await pool.query(
      `UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *`,
      [quantity, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateQuantity:", error);
    throw error;
  }
};

// Tambahkan fungsi getCartCount

exports.getCartCount = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT SUM(quantity) as count FROM cart WHERE user_id = $1`,
      [user_id]
    );
    return parseInt(result.rows[0].count || 0);
  } catch (error) {
    console.error("Error in getCartCount:", error);
    throw error;
  }
};