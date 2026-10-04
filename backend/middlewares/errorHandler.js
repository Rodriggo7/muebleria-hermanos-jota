export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Internal] ${err.message}`);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: statusCode === 500 ? "Error interno del servidor" : err.name,
    mensaje: statusCode === 500 
      ? "Ocurrió un problema al procesar la solicitud. Nuestros artesanos están trabajando en ello."
      : err.message
  });
};