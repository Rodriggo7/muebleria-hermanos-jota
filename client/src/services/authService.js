import { apiFetch } from './api.js';

// Misma clave que lee apiFetch (services/api.js) para mandar Authorization: Bearer <token>.
const TOKEN_KEY = 'token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// POST /auth/login → { user, token }
export function login({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } });
}

// POST /auth/register → { user, token }. phone es opcional.
export function register({ name, email, password, phone }) {
  return apiFetch('/auth/register', { method: 'POST', body: { name, email, password, phone } });
}

// GET /auth/me → usuario del token (sin password).
export function getMe() {
  return apiFetch('/auth/me');
}

// GET /users/profile → usuario completo.
export function getProfile() {
  return apiFetch('/users/profile');
}

// PUT /users/profile con { name?, phone? } → usuario actualizado.
export function updateProfile({ name, phone }) {
  return apiFetch('/users/profile', { method: 'PUT', body: { name, phone } });
}
