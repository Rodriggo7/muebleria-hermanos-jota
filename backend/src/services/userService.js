import mongoose from "mongoose";
import { VALID_ROLES } from "../constants/roles.js";
import userRepository from "../repositories/userRepository.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const getProfile = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("El identificador de usuario no es válido", 400);
  }

  const user = await userRepository.findById(userId);
  if (!user || !user.isActive) {
    throw createError("Usuario no encontrado", 404);
  }

  return sanitizeUser(user);
};

export const updateProfile = async (userId, { name, phone }) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("El identificador de usuario no es válido", 400);
  }

  const allowedUpdates = {};

  if (name !== undefined) {
    allowedUpdates.name = name.trim();
  }

  if (phone !== undefined) {
    allowedUpdates.phone = phone === null ? "" : phone.trim();
  }

  if (Object.keys(allowedUpdates).length === 0) {
    throw createError(
      "No se proporcionaron campos válidos para actualizar",
      400
    );
  }

  const updatedUser = await userRepository.updateById(userId, allowedUpdates);
  if (!updatedUser) {
    throw createError("Usuario no encontrado", 404);
  }

  return sanitizeUser(updatedUser);
};

export const getAllUsers = async (query = {}) => {
  const filters = {};

  if (query.role !== undefined) {
    if (!VALID_ROLES.includes(query.role)) {
      throw createError("El filtro de rol no es válido", 400);
    }
    filters.role = query.role;
  }

  if (query.isActive !== undefined) {
    if (query.isActive !== "true" && query.isActive !== "false") {
      throw createError(
        "El filtro isActive debe ser 'true' o 'false'",
        400
      );
    }
    filters.isActive = query.isActive === "true";
  }

  const users = await userRepository.findAll(filters);
  return users.map(sanitizeUser);
};

export const getUserById = async (targetUserId) => {
  if (!mongoose.isValidObjectId(targetUserId)) {
    throw createError("El identificador de usuario no es válido", 400);
  }

  const user = await userRepository.findById(targetUserId);
  if (!user) {
    throw createError("Usuario no encontrado", 404);
  }

  return sanitizeUser(user);
};

export const updateUserRole = async (targetUserId, role, requesterId) => {
  if (!mongoose.isValidObjectId(targetUserId)) {
    throw createError("El identificador de usuario no es válido", 400);
  }

  if (!VALID_ROLES.includes(role)) {
    throw createError("El rol especificado no es válido", 400);
  }

  if (targetUserId.toString() === requesterId.toString()) {
    throw createError(
      "Un administrador no puede modificar su propio rol",
      400
    );
  }

  const updatedUser = await userRepository.updateRole(targetUserId, role);
  if (!updatedUser) {
    throw createError("Usuario no encontrado", 404);
  }

  return sanitizeUser(updatedUser);
};

export const deactivateUser = async (targetUserId, requesterId) => {
  if (!mongoose.isValidObjectId(targetUserId)) {
    throw createError("El identificador de usuario no es válido", 400);
  }

  if (targetUserId.toString() === requesterId.toString()) {
    throw createError(
      "Un administrador no puede desactivar su propia cuenta",
      400
    );
  }

  const deactivatedUser = await userRepository.deactivate(targetUserId);
  if (!deactivatedUser) {
    throw createError("Usuario no encontrado", 404);
  }

  return sanitizeUser(deactivatedUser);
};

export default {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
};