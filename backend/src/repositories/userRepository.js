import User from "../models/User.js";

export const findByEmail = async (email) =>
  User.findOne({ email }).lean();

export const findByEmailWithPassword = async (email) =>
  User.findOne({ email }).select("+password").lean();

export const findById = async (id) =>
  User.findById(id).lean();

export const findAll = async (filters = {}) =>
  User.find(filters).sort({ createdAt: -1 }).lean();

export const create = async (userData) => {
  const user = await User.create(userData);
  return user.toObject();
};

export const updateById = async (id, updateData) =>
  User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .lean();

export const updateRole = async (id, role) =>
  User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();

export const deactivate = async (id) =>
  User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();

export default {
  findByEmail,
  findByEmailWithPassword,
  findById,
  findAll,
  create,
  updateById,
  updateRole,
  deactivate,
};