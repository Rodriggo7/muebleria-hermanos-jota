import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { createOrder } from '../services/orderService.js';

const STORAGE_KEY = 'hj_cart';

const ADD_ITEM = 'ADD_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const REMOVE_ITEM = 'REMOVE_ITEM';
const CLEAR = 'CLEAR';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

// Stock máximo de un producto. Si la API no lo informa, no se pone tope.
function maxStock(stock) {
  const value = Number(stock);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : Infinity;
}

// La cantidad siempre queda entre 1 y el stock disponible.
function clampQuantity(quantity, stock) {
  const value = Math.floor(Number(quantity));
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(value, 1), maxStock(stock));
}

function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM: {
      const { product, quantity } = action.payload;
      if (!product?._id || maxStock(product.stock) < 1) return state;

      const existing = state.find((item) => item._id === product._id);
      if (existing) {
        // Toma el stock más reciente del producto recibido.
        const stock = product.stock ?? existing.stock;
        return state.map((item) =>
          item._id === product._id
            ? { ...item, stock, quantity: clampQuantity(item.quantity + quantity, stock) }
            : item
        );
      }

      const { _id, name, price, images, stock } = product;
      return [...state, { _id, name, price, images, stock, quantity: clampQuantity(quantity, stock) }];
    }

    case UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      return state.map((item) =>
        item._id === id ? { ...item, quantity: clampQuantity(quantity, item.stock) } : item
      );
    }

    case REMOVE_ITEM:
      return state.filter((item) => item._id !== action.payload.id);

    case CLEAR:
      return [];

    default:
      return state;
  }
}

// Se ejecuta una sola vez al montar (tercer argumento de useReducer).
function loadInitialItems(fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored.filter((item) => item && item._id) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage no disponible o lleno: el carrito sigue funcionando en memoria.
    }
  }, [items]);

  const addItem = useCallback(
    (product, quantity = 1) => dispatch({ type: ADD_ITEM, payload: { product, quantity } }),
    []
  );

  const updateQuantity = useCallback(
    (id, quantity) => dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity } }),
    []
  );

  const removeItem = useCallback((id) => dispatch({ type: REMOVE_ITEM, payload: { id } }), []);

  const clearCart = useCallback(() => dispatch({ type: CLEAR }), []);

  const getQuantity = useCallback(
    (id) => items.find((item) => item._id === id)?.quantity ?? 0,
    [items]
  );

  // Si createOrder falla, el error se propaga y el carrito no se vacía.
  const checkout = useCallback(async () => {
    const order = await createOrder({
      items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
    });
    dispatch({ type: CLEAR });
    return order;
  }, [items]);

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);

    return {
      items,
      totalItems,
      totalPrice,
      isEmpty: items.length === 0,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getQuantity,
      checkout,
    };
  }, [items, addItem, updateQuantity, removeItem, clearCart, getQuantity, checkout]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
