const errorMiddleware = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Error interno del servidor";

  // Errores de validación de Mongoose
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(". ");
  }

  // Identificador de MongoDB con formato inválido
  if (error.name === "CastError") {
    statusCode = 400;
    message = "El identificador proporcionado no es válido";
  }

  // Documento duplicado en MongoDB
  if (error.code === 11000) {
    statusCode = 409;
    message = "Ya existe un registro con esos datos";
  }

  if (statusCode >= 500) {
    console.error(error);
    message = "Error interno del servidor";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
