const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const validateRegister = (req, res, next) => {
  const { name, email, password, phone } = req.body || {};

  if (typeof name !== "string" || name.trim().length < 2) {
    return next(
      createValidationError("El nombre es obligatorio y debe tener al menos 2 caracteres")
    );
  }

  if (name.trim().length > 100) {
    return next(
      createValidationError("El nombre no puede superar los 100 caracteres")
    );
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return next(
      createValidationError("Debe proporcionar un correo electrónico válido")
    );
  }

  if (typeof password !== "string" || password.length < 8) {
    return next(
      createValidationError("La contraseña debe tener al menos 8 caracteres")
    );
  }

  if (password.length > 72) {
    return next(
      createValidationError("La contraseña no puede superar los 72 caracteres")
    );
  }

  if (phone !== undefined && phone !== null) {
    if (typeof phone !== "string" || phone.trim().length > 30) {
      return next(
        createValidationError("El teléfono debe ser un texto de hasta 30 caracteres")
      );
    }
  }

  return next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return next(
      createValidationError("Debe proporcionar un correo electrónico válido")
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return next(createValidationError("La contraseña es obligatoria"));
  }

  return next();
};

export default {
  validateRegister,
  validateLogin,
};