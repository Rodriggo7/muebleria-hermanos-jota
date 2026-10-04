const rutaJsonUrl = new URL('../data/productos.json', import.meta.url);

export async function obtenerTodosLosProductos() {
  const respuesta = await fetch(rutaJsonUrl);
  const productos = await respuesta.json();
  return productos;
}

export async function obtenerProductoPorId(id) {
  const productos = await obtenerTodosLosProductos();
  return productos.find((p) => p.id === Number(id));
}