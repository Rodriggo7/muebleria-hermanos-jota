import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";
import userRepository from "../repositories/userRepository.js";
import { generateToken } from "../utils/generateToken.js";

const SALT_ROUNDS = 10;

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

export const register = async ({ name, email, password, phone }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) {
    throw createError(
      "Ya existe una cuenta registrada con ese correo electrónico",
      409
    );
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const createdUser = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: typeof phone === "string" ? phone.trim() : "",
    role: ROLES.USER,
  });

  const safeUser = sanitizeUser(createdUser);
  const token = generateToken({
    id: safeUser._id,
    role: safeUser.role,
  });

  return {
    user: safeUser,
    token,
  };
};

export const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await userRepository.findByEmailWithPassword(normalizedEmail);
  if (!user) {
    throw createError("Credenciales inválidas", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError("Credenciales inválidas", 401);
  }

  if (!user.isActive) {
    throw createError("La cuenta de usuario se encuentra desactivada", 401);
  }

  const safeUser = sanitizeUser(user);
  const token = generateToken({
    id: safeUser._id,
    role: safeUser.role,
  });

  return {
    user: safeUser,
    token,
  };
};

export const getCurrentUser = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("El identificador de usuario no es válido", 400);
  }

  const user = await userRepository.findById(userId);
  if (!user || !user.isActive) {
    throw createError("Usuario no encontrado", 404);
  }

  return sanitizeUser(user);
};

export default {
  register,
  login,
  getCurrentUser,
};