import Order from "../models/Order.js";

export const create = async (orderData, session) => {
  const [order] = await Order.create([orderData], { session });
  return order.toObject();
};

export const findById = async (id) =>
  Order.findById(id).populate("items.product").lean();

export const findByUser = async (userId) =>
  Order.find({ user: userId }).sort({ createdAt: -1 }).lean();

export const findAll = async () =>
  Order.find().sort({ createdAt: -1 }).lean();

export const updateStatus = async (id, status) =>
  Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).lean();

export default {
  create,
  findById,
  findByUser,
  findAll,
  updateStatus,
};
