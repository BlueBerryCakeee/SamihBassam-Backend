const db = require("../database/pg.database");

exports.createItem = async (name, price, store_id, image_url, stock) => {
  const res = await db.query(
    "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, price, store_id, image_url, stock]
  );
  return res.rows[0];
};

exports.getAllItems = async () => {
  const res = await db.query("SELECT * FROM items");
  return res.rows;
};

exports.getItemById = async (id) => {
  const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
  return res.rows[0];
};

exports.getItemsByStore = async (store_id) => {
  const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
  return res.rows;
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
