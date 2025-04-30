const storeRepository = require("../repositories/store.repositories");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    baseResponse(res, true, 200, "Successfully retrieved all stores", stores);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to retrieve all stores", error.message);
  }
};

exports.getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await storeRepository.getStoreById(id);
    if (!store) {
      return baseResponse(res, false, 404, "Store not found", null);
    }
    baseResponse(res, true, 200, "Successfully retrieved store", store);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to retrieve store", error.message);
  }
};

exports.createStore = async (req, res) => {
  if (!req.body.name || !req.body.address) {
    return baseResponse(res, false, 400, "Name and Address are required", null);
  }
  try {
    const store = await storeRepository.createStore(req.body);
    baseResponse(res, true, 201, "Successfully created store", store);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to create store", error.message);
  }
};

exports.updateStore = async (req, res) => {
  const { id, name, address } = req.body;
  if (!id || !name || !address) {
    return baseResponse(res, false, 400, "Name and Address are required", null);
  }
  try {
    const store = await storeRepository.updateStore({ id, name, address });
    if (!store) {
      return baseResponse(res, false, 404, "Store not found", null);
    }
    baseResponse(res, true, 200, "Successfully updated store", store);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to update store", error.message);
  }
};

exports.deleteStore = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return baseResponse(res, false, 400, "ID is required", null);
  }

  try {
    const result = await storeRepository.deleteStore(id);

    if (!result.success) {
      return baseResponse(res, false, 404, result.message, null);
    }

    baseResponse(res, true, 200, result.message, null);
  } catch (error) {
    baseResponse(res, false, 500, "Failed to delete store", error.message);
  }
};
