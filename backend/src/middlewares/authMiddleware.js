import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userRepository from "../repositories/userRepository.js";

const createAuthError = (message, statusCode = 401) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(
        createAuthError("Token de autenticación no proporcionado", 401)
      );
    }

    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return next(
        createAuthError("Formato de token inválido. Usar: Bearer <token>", 401)
      );
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next(
        createAuthError("JWT_SECRET no está configurado en el servidor", 500)
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(createAuthError("El token ha expirado", 401));
      }
      return next(createAuthError("Token inválido", 401));
    }

    if (!decoded?.id || !mongoose.isValidObjectId(decoded.id)) {
      return next(createAuthError("Token inválido", 401));
    }

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return next(
        createAuthError("Usuario no encontrado o no autorizado", 401)
      );
    }

    if (!user.isActive) {
      return next(
        createAuthError("La cuenta de usuario se encuentra desactivada", 401)
      );
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticateToken;