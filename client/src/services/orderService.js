// Integración: Mateo debe verificar la conexión con el backend.
import { apiFetch, USE_MOCK } from './api.js';

const MOCK_DELAY_MS = 300;

export async function createOrder(order) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return { _id: 'mock-order', ...order, status: 'pending' };
  }

  return apiFetch('/orders', { method: 'POST', body: order });
}

// Obtiene el historial de pedidos del usuario autenticado.
export async function getMyOrders() {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return [];
  }

  return apiFetch('/orders/my-orders');
}