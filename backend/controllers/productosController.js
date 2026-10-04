import { obtenerTodosLosProductos, obtenerProductoPorId } from '../services/productosService.js';

// GET /api/productos
export function getProductos(req, res, next) {
  try {
    const productos = obtenerTodosLosProductos();
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
}

// GET /api/productos/:id
export function getProductoById(req, res, next) {
  try {
    const { id } = req.params;
    const producto = obtenerProductoPorId(id);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
        mensaje: `No existe ningún producto con el identificador ID ${id}.`
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}