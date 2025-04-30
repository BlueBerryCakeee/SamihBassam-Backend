const transactionRepository = require("../repositories/transaction.repositories");
const baseResponse = require("../utils/baseResponse.util");

// CREATE TRANSACTION
exports.createTransaction = async (req, res) => {
  try {
    const { user_id, item_id, quantity } = req.body;

    if (!user_id || !item_id || !quantity) {
      return baseResponse(res, false, 400, "User ID, Item ID, and quantity are required", null);
    }

    if (quantity <= 0) {
      return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
    }

    const transaction = await transactionRepository.createTransaction(user_id, item_id, quantity);

    return baseResponse(res, true, 201, "Transaction created successfully", transaction);
  } catch (error) {
    console.error("Error in createTransaction:", error);
    return baseResponse(res, false, 500, "Failed to create transaction", error.message);
  }
};

// PAY TRANSACTION (Menggunakan req.params)
exports.payTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params; // Ambil transaction_id dari URL

    if (!transaction_id) {
      return baseResponse(res, false, 400, "Transaction ID is required", null);
    }

    const transaction = await transactionRepository.payTransaction(transaction_id);

    if (!transaction) {
      return baseResponse(res, false, 400, "Insufficient balance or transaction not found", null);
    }

    return baseResponse(res, true, 200, "Payment successful", transaction);
  } catch (error) {
    console.error("Error in payTransaction:", error);
    return baseResponse(res, false, 500, "Failed to process payment", error.message);
  }
};

// DELETE TRANSACTION
exports.deleteTransaction = async (req, res) => {
    try {
      const { transaction_id } = req.params; // Ambil transaction_id dari URL
  
      if (!transaction_id) {
        return baseResponse(res, false, 400, "Transaction ID is required", null);
      }
  
      const transaction = await transactionRepository.deleteTransaction(transaction_id);
  
      if (!transaction) {
        return baseResponse(res, false, 404, "Transaction not found", null);
      }
  
      return baseResponse(res, true, 200, "Transaction deleted successfully", transaction);
    } catch (error) {
      console.error("Error in deleteTransaction:", error);
      return baseResponse(res, false, 500, "Failed to delete transaction", error.message);
    }
  };

  exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactionsWithDetails();

        const formatted = transactions.map((t) => ({
            id: t.id,
            user_id: t.user_id,
            item_id: t.item_id,
            quantity: t.quantity,
            total: t.total,
            status: t.status,
            created_at: t.created_at,
            user: {
                id: t.user_id,
                name: t.user_name,
                email: t.user_email,
                password: t.user_password,
                balance: t.user_balance,
                created_at: t.user_created_at,
            },
            item: {
                id: t.item_id,
                name: t.item_name,
                price: t.item_price,
                stock: t.item_stock,
                image_url: t.item_image_url,
                created_at: t.item_created_at,
            }
        }));

        baseResponse(res, true, 200, "Transactions found", formatted);
    } catch (error) {
        baseResponse(res, false, 500, "Failed to fetch transactions", error);
    }
};