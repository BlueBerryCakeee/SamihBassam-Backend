const baseResponse = require("../utils/baseResponse.util");
const cartRepository = require("../repositories/cart.repositories");
const userRepository = require("../repositories/user.repositories");
const { pool } = require("../database/pg.database");

exports.processCheckout = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return baseResponse(res, false, 400, "User ID is required", null);
  }

  try {
    // Ambil item dari keranjang
    const cartItems = await cartRepository.getCartItems(user_id);
    
    if (!cartItems || cartItems.length === 0) {
      return baseResponse(res, false, 400, "Cart is empty", null);
    }

    // Hitung total harga
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Ambil data user untuk cek saldo
    const user = await userRepository.getUserById(user_id);
    
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    
    // Perbaiki kondisi pengecekan saldo
    // Cek saldo mencukupi - pastikan keduanya adalah number dan perbandingan benar
    const userBalance = parseFloat(user.balance);
    const orderTotal = parseFloat(totalAmount);

    console.log('Debug - User Balance:', userBalance, typeof userBalance);
    console.log('Debug - Order Total:', orderTotal, typeof orderTotal);

    if (userBalance < orderTotal) {
      return baseResponse(res, false, 400, "Insufficient balance", {
        balance: userBalance,
        total: orderTotal
      });
    }
    
    // Mulai transaksi database
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Kurangi saldo user
      const updatedUser = await userRepository.updateBalance(
        user_id, 
        user.balance - totalAmount, 
        client
      );
      
      // Buat order/transaction record
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id`,
        [user_id, totalAmount]
      );
      
      const orderId = orderResult.rows[0].id;
      
      // Tambahkan item ke order_items
      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (order_id, item_id, quantity, price) 
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.item_id, item.quantity, item.price]
        );
      }
      
      // Hapus item dari keranjang
      await client.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);
      
      // Tambahkan kode ini setelah berhasil checkout

      // Untuk produk dengan stok 1 yang habis setelah dibeli
      for (const item of cartItems) {
        if (item.stock <= item.quantity) {
          // Hapus item dari katalog jika stok habis
          await client.query(`DELETE FROM items WHERE id = $1`, [item.item_id]);
        } else {
          // Kurangi stok
          await client.query(
            `UPDATE items SET stock = stock - $1 WHERE id = $2`,
            [item.quantity, item.item_id]
          );
        }
      }

      await client.query('COMMIT');
      
      return baseResponse(res, true, 200, "Checkout successful", {
        order_id: orderId,
        total_amount: totalAmount,
        user: updatedUser
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing checkout:", error);
    return baseResponse(res, false, 500, "Failed to process checkout", error.message);
  }
};