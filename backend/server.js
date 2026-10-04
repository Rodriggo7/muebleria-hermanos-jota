// backend/server.js
import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './middlewares/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST Mueblería Hermanos Jota activa' });
});

app.listen(PORT, () => {
  console.log(`Servidor de Hermanos Jota corriendo en http://localhost:${PORT}`);
});