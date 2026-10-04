import { productos } from '../mockup/productos.js';

export function obtenerTodosLosProductos() {
  return productos;
}

export function obtenerProductoPorId(id) {
  const coincidencias = productos.filter((p) => p.id === Number(id));
  return coincidencias.length > 0 ? coincidencias[0] : null;
}