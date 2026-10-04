// backend/middlewares/cors.js
import cors from 'cors';

export const corsMiddleware = cors({
  origin: 'http://localhost:5173', // Permite solicitudes desde el cliente React
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Encabezados permitidos
  credentials: false // No requiere envío de cookies ni credenciales
});