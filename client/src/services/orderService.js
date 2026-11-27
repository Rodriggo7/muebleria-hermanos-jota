// Pedidos del usuario logueado (ver backend/src/routes/orderRoutes.js).
// Todas las rutas requieren token; apiFetch lo agrega desde localStorage.
import { apiFetch, USE_MOCK } from './api.js';
import { getProductById } from './productService.js';

const MOCK_DELAY_MS = 300;

// Mock: pedidos creados en esta sesión, con la misma forma que devuelve el backend.
const mockOrders = [];

const mockDelay = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// POST /orders con { items: [{ productId, quantity }] } → pedido creado.
export async function createOrder(order) {
  if (USE_MOCK) {
    await mockDelay();
    const items = await Promise.all(
      order.items.map(async ({ productId, quantity }) => {
        const product = await getProductById(productId);
        return {
          product: product._id,
          productName: product.name,
          unitPrice: product.price,
          quantity,
          subtotal: product.price * quantity,
        };
      })
    );
    const created = {
      _id: `mock-order-${Date.now()}`,
      items,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockOrders.unshift(created);
    return created;
  }

  return apiFetch('/orders', { method: 'POST', body: order });
}

// GET /orders/my-orders → pedidos del usuario, del más nuevo al más viejo.
export async function getMyOrders() {
  if (USE_MOCK) {
    await mockDelay();
    return [...mockOrders];
  }

  return apiFetch('/orders/my-orders');
}
