const { pool } = require("../database/pg.database");

// CREATE TRANSACTION
exports.createTransaction = async (user_id, item_id, quantity) => {
  try {
    const client = await pool.connect();

    // 🔹 Cek apakah item tersedia
    const itemResult = await client.query("SELECT * FROM items WHERE id = $1", [item_id]);
    if (itemResult.rowCount === 0) {
      throw new Error("Item not found");
    }

    const item = itemResult.rows[0];

    // 🔹 Pastikan stok mencukupi
    if (item.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const total = item.price * quantity;

    // 🔹 Insert transaksi
    const result = await client.query(
      "INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *",
      [user_id, item_id, quantity, total]
    );

    client.release();
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// PAY TRANSACTION (Menggunakan transaction_id dari URL)
exports.payTransaction = async (transaction_id) => {
  try {
    const client = await pool.connect();

    // 🔹 Ambil transaksi berdasarkan ID
    const transactionResult = await client.query("SELECT * FROM transactions WHERE id = $1", [transaction_id]);
    if (transactionResult.rowCount === 0) {
      client.release();
      return null; // Transaksi tidak ditemukan
    }

    const transaction = transactionResult.rows[0];

    //  Ambil saldo user berdasarkan transaksi
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [transaction.user_id]);
    if (userResult.rowCount === 0) {
      client.release();
      return null; // User tidak ditemukan
    }

    const user = userResult.rows[0];

    //  Cek apakah saldo cukup untuk membayar transaksi
    if (user.balance < transaction.total) {
      client.release();
      return null; // Saldo tidak mencukupi
    }

    //  Kurangi saldo user
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [transaction.total, transaction.user_id]
    );

    //  Update status transaksi menjadi 'paid'
    const updatedTransaction = await client.query(
      "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
      [transaction_id]
    );

    client.release();
    return updatedTransaction.rows[0];
  } catch (error) {
    throw error;
  }
};

// DELETE TRANSACTION
exports.deleteTransaction = async (transaction_id) => {
    try {
      //  Cek apakah transaksi ada sebelum dihapus
      const checkTransaction = await pool.query("SELECT * FROM transactions WHERE id = $1", [transaction_id]);
      if (checkTransaction.rowCount === 0) {
        return null; // Transaksi tidak ditemukan
      }
  
      // Hapus transaksi jika ditemukan
      const result = await pool.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [transaction_id]);
  
      return result.rows[0]; // Return transaksi yang berhasil dihapus
    } catch (error) {
      throw error;
    }
  };

exports.getAllTransactionsWithDetails = async () => {
    try {
        const res = await db.query(`
            SELECT 
                t.*, 
                u.name AS user_name, u.email AS user_email, u.password AS user_password, u.balance AS user_balance, u.created_at AS user_created_at,
                i.name AS item_name, i.price AS item_price, i.stock AS item_stock, i.image_url AS item_image_url, i.created_at AS item_created_at
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN items i ON t.item_id = i.id
        `);

        return res.rows;
    } catch (error) {
        console.error("Error fetching transactions with details:", error);
        throw error;
    }
};