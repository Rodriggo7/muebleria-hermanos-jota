import { Router } from 'express';
import { getProductos, getProductoById } from '../controllers/productosController.js';

const router = Router();

// sub-rutas montadas en /api/productos
router.get('/', getProductos);
router.get('/:id', getProductoById);

export default router;