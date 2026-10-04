const API_BASE_URL = 'http://localhost:3001/api/productos';

// GET /api/productos - Listado completo
export async function getProductos() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('No se pudo obtener el catálogo de la casa taller.');
  }
  return await response.json();
}

// GET /api/productos/:id - Detalle por identificador
export async function getProductoById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Ocurrió un inconveniente al consultar la pieza.');
  }
  return await response.json();
}