// PROVISIONAL (Maxi): Rodri reemplaza este archivo en la integración.
import { apiFetch, USE_MOCK } from './api.js';

const MOCK_DELAY_MS = 300;

export async function createOrder(order) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return { _id: 'mock-order', ...order, status: 'pending' };
  }

  return apiFetch('/orders', { method: 'POST', body: order });
}
