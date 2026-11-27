// Cliente HTTP de la app. Todas las respuestas de la API tienen la forma { success, message, data }.

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const API_URL = import.meta.env.VITE_API_URL;

// Misma clave que usa AuthContext (services/authService.js) para guardar el JWT.
const TOKEN_KEY = 'token';

const NETWORK_ERROR_MESSAGE = 'No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.';

export async function apiFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    // Sin respuesta del servidor (red caída, backend apagado, CORS).
    // Sigue siendo TypeError: AuthContext y CartContext lo usan para no borrar sesión ni carrito.
    throw new TypeError(NETWORK_ERROR_MESSAGE, { cause });
  }

  // Si la respuesta no es JSON, queda json = null.
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Error ${res.status} en la petición`);
  }

  return json.data;
}
