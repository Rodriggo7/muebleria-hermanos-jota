import { VALID_ROLES } from "../constants/roles.js";

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const validateUpdateProfile = (req, res, next) => {
  const { name, phone } = req.body || {};

  if (name === undefined && phone === undefined) {
    return next(
      createValidationError(
        "Debe proporcionar al menos un campo válido para actualizar (name o phone)"
      )
    );
  }

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return next(
        createValidationError("El nombre debe tener al menos 2 caracteres")
      );
    }

    if (name.trim().length > 100) {
      return next(
        createValidationError("El nombre no puede superar los 100 caracteres")
      );
    }
  }

  if (phone !== undefined && phone !== null) {
    if (typeof phone !== "string" || phone.trim().length > 30) {
      return next(
        createValidationError(
          "El teléfono debe ser un texto de hasta 30 caracteres"
        )
      );
    }
  }

  return next();
};

export const validateUpdateRole = (req, res, next) => {
  const { role } = req.body || {};

  if (typeof role !== "string" || !VALID_ROLES.includes(role)) {
    return next(
      createValidationError(
        `El rol no es válido. Valores permitidos: ${VALID_ROLES.join(", ")}`
      )
    );
  }

  return next();
};

export default {
  validateUpdateProfile,
  validateUpdateRole,
};