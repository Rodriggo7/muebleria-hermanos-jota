import express from 'express';
import { corsMiddleware } from './middlewares/corsMiddleware.js';
import { loggerMiddleware } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import productRoutes from './routes/productosRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;


// Middlewares globales
app.use(corsMiddleware);
app.use(express.json());
app.use(loggerMiddleware);

// Rutas de la API
app.use('/api/productos', productRoutes);

// Ruta raíz de verificación
app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST Mueblería Hermanos Jota activa' });
});

// Middlewares de cierre (404 y Control Centralizado de Errores)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor de Hermanos Jota corriendo en http://localhost:${PORT}`);
});