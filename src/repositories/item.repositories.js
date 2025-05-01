const db = require("../database/pg.database");

exports.createItem = async (name, price, store_id, image_url, stock) => {
  try {
    const { rows } = await db.query(
      `INSERT INTO items (name, price, store_id, image_url, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, price, store_id, image_url, stock]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in createItem:", error);
    throw error;
  }
};

exports.getAllItems = async () => {
  try {
    const { rows } = await db.query(
      `SELECT i.*, s.name as store_name 
       FROM items i
       LEFT JOIN stores s ON i.store_id = s.id
       WHERE i.stock > 0 AND (i.status IS NULL OR i.status = 'active')
       ORDER BY i.created_at DESC`
    );
    return rows;
  } catch (error) {
    console.error("Error in getAllItems:", error);
    throw error;
  }
};

exports.getItemById = async (id) => {
  try {
    const { rows } = await db.query(
      `SELECT i.*, s.name as store_name
       FROM items i 
       LEFT JOIN stores s ON i.store_id = s.id
       WHERE i.id = $1`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in getItemById:", error);
    throw error;
  }
};

exports.getItemsByStore = async (store_id) => {
  try {
    const { rows } = await db.query(
      `SELECT i.*
       FROM items i
       WHERE i.store_id = $1 AND i.stock > 0 AND (i.status IS NULL OR i.status = 'active')
       ORDER BY i.created_at DESC`,
      [store_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getItemsByStore:", error);
    throw error;
  }
};

exports.updateItem = async (id, name, price, image_url, stock) => {
  const res = await db.query(
    "UPDATE items SET name = $1, price = $2, image_url = $3, stock = $4 WHERE id = $5 RETURNING *",
    [name, price, image_url, stock, id]
  );
  return res.rows[0];
};

exports.deleteItem = async (id) => {
  const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
  return res.rows[0];
};
