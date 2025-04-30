const itemRepository = require("../repositories/item.repositories");
const baseResponse = require("../utils/baseResponse.util");

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: "duegqdft3",
  api_key: "123956948298991",
  api_secret: "aof-im7TtwU7Z3sF3gnjxYELjT0"
});

// Ambil semua item
exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    baseResponse(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to retrieve items", error.message);
  }
};

exports.createItem = async (req, res) => {
  const { name, price, store_id, stock } = req.body;

  if (!name || !price || !store_id) {
    return baseResponse(res, false, 400, "Name, Price, and Store ID are required", null);
  }

  let image_url = null;
  if (req.file) {
    try {
      console.log("Uploading image to Cloudinary...");
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "items" },
          (error, result) => {
            if (error) {
              console.error("Upload error:", error);
              reject(error);
            } else {
              console.log("Upload success, Image URL:", result.secure_url);
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      image_url = result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return baseResponse(res, false, 500, "Failed to upload image", error.message);
    }
  }

  console.log("Final Image URL:", image_url); // 🔹 Debugging hasil upload gambar

  try {
    const item = await itemRepository.createItem(name, price, store_id, image_url, stock);
    baseResponse(res, true, 201, "Item created successfully", item);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to create item", error.message);
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await itemRepository.getItemById(id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    baseResponse(res, true, 200, "Item retrieved successfully", item);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to retrieve item", error.message);
  }
};

// Ambil semua item berdasarkan store_id
exports.getItemsByStore = async (req, res) => {
  const { store_id } = req.params;
  try {
    const items = await itemRepository.getItemsByStore(store_id);
    baseResponse(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to retrieve items", error.message);
  }
};

exports.updateItem = async (req, res) => {
  const { id, name, price, stock } = req.body;

  if (!id) {
    return baseResponse(res, false, 400, "Item ID is required", null);
  }

  let image_url = null;
  if (req.file) {
    try {
      console.log("Uploading new image to Cloudinary...");
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "items" },
          (error, result) => {
            if (error) {
              console.error("Upload error:", error);
              reject(error);
            } else {
              console.log("Upload success, Image URL:", result.secure_url);
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      image_url = result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return baseResponse(res, false, 500, "Failed to upload image", error.message);
    }
  }

  try {
    const item = await itemRepository.updateItem(id, name, price, image_url, stock);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    baseResponse(res, true, 200, "Item updated successfully", item);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to update item", error.message);
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await itemRepository.deleteItem(id);
    baseResponse(res, true, 200, "Item deleted successfully", result);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to delete item", error.message);
  }
};
