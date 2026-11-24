import { ROLES } from "../constants/roles.js";

const createAccessError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(createAccessError("Autenticación requerida", 401));
  }

  if (req.user.role !== ROLES.ADMIN) {
    return next(
      createAccessError(
        "Acceso denegado: se requieren permisos de administrador",
        403
      )
    );
  }

  return next();
};

export default requireAdmin;