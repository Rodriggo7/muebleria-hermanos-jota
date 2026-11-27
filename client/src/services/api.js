// PROVISIONAL (Maxi): Rodri reemplaza este archivo en la integración.

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const API_URL = import.meta.env.VITE_API_URL;

// Clave provisional: confirmar con Rodri dónde guarda el token el AuthContext.
const TOKEN_KEY = 'token';

export async function apiFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // La API responde { success, message, data }. Si no es JSON, queda json = null.
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Error ${res.status} en la petición`);
  }

  return json.data;
}
