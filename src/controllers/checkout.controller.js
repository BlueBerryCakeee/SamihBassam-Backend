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
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    // Ambil data user untuk cek saldo
    const user = await userRepository.getUserById(user_id);
    
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    
    // Pastikan saldo mencukupi - konversi ke number untuk perbandingan yang benar
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
        userBalance - orderTotal, 
        client
      );
      
      // Buat order/transaction record
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id`,
        [user_id, orderTotal]
      );
      
      const orderId = orderResult.rows[0].id;
      
      // Tambahkan item ke order_items dengan subtotal
      for (const item of cartItems) {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseInt(item.quantity);
        const subtotal = itemPrice * itemQuantity;
        
        console.log(`Processing order item: ${item.name || 'Unknown'}, price: ${itemPrice}, quantity: ${itemQuantity}, subtotal: ${subtotal}`);
        
        await client.query(
          `INSERT INTO order_items (order_id, item_id, quantity, price, subtotal) 
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.item_id, itemQuantity, itemPrice, subtotal]
        );
      }
      
      // Hapus item dari keranjang
      await client.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);
      
      // Update stok dan tandai item dengan stok habis sebagai "out_of_stock"
      for (const item of cartItems) {
        // Dapatkan stok terbaru dari database
        const stockResult = await client.query(
          `SELECT stock FROM items WHERE id = $1`,
          [item.item_id]
        );
        
        if (stockResult.rows.length > 0) {
          const currentStock = parseInt(stockResult.rows[0].stock);
          const purchasedQuantity = parseInt(item.quantity);
          const newStock = currentStock - purchasedQuantity;
          
          if (newStock <= 0) {
            console.log(`Marking item ${item.item_id} as out_of_stock`);
            // Set stok 0 dan status "out_of_stock"
            await client.query(
              `UPDATE items SET stock = 0, status = 'out_of_stock' WHERE id = $1`,
              [item.item_id]
            );
          } else {
            console.log(`Updating stock for item ${item.item_id}: ${currentStock} - ${purchasedQuantity} = ${newStock}`);
            // Kurangi stok
            await client.query(
              `UPDATE items SET stock = $1 WHERE id = $2`,
              [newStock, item.item_id]
            );
          }
        }
      }

      await client.query('COMMIT');
      
      return baseResponse(res, true, 200, "Checkout successful", {
        order_id: orderId,
        total_amount: orderTotal,
        user: updatedUser
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Transaction error:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing checkout:", error);
    return baseResponse(res, false, 500, "Failed to process checkout", error.message);
  }
};