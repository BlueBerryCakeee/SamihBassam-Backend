const db = require("../database/pg.database");

exports.getAllStores = async () => {
  try {
    const res = await db.query("SELECT * FROM stores");
    return res.rows;
  } catch (error) {
    console.error("Failed to get all stores", error);
    throw error;
  }
};

exports.getStoreById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Failed to get store by id", error);
    throw error;
  }
};

exports.createStore = async (store) => {
  try {
    const res = await db.query(
      "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
      [store.name, store.address]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Failed to create store", error);
    throw error;
  }
};

exports.updateStore = async (store) => {
  try {
    console.log("Updating store with ID:", store.id);
    const res = await db.query(
      "UPDATE stores SET name = $1, address = $2 WHERE id::text = $3 RETURNING *",
      [store.name, store.address, store.id]
    );
    console.log("Update result:", res);
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error("Failed to update store", error);
    throw error;
  }
};

exports.deleteStore = async (id) => {
  try {
    console.log("Deleting store with ID:", id);
    const res = await db.query("DELETE FROM stores WHERE id::text = $1 RETURNING *", [id]);
    console.log("Delete result:", res.rows);
    return res.rowCount > 0 ? { success: true, message: "Store deleted successfully" } : { success: false, message: "Store not found" };
  } catch (error) {
    console.error("Failed to delete store", error);
    throw error;
  }
};