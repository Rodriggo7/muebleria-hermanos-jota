import { createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createOrder } from '../services/orderService.js';
import { getProductById } from '../services/productService.js';

const STORAGE_KEY = 'hj_cart';

const ADD_ITEM = 'ADD_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const REMOVE_ITEM = 'REMOVE_ITEM';
const CLEAR = 'CLEAR';
const SYNC = 'SYNC';

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

    // Aplica los datos frescos de la API: quita los no disponibles y actualiza el resto.
    // Solo toca los productos que se verificaron; lo agregado mientras tanto queda igual.
    case SYNC: {
      const { updates, removedIds } = action.payload;
      return state
        .filter((item) => !removedIds.includes(item._id))
        .map((item) => {
          const product = updates[item._id];
          if (!product) return item;
          const { name, price, images, stock } = product;
          return { ...item, name, price, images, stock, quantity: clampQuantity(item.quantity, stock) };
        });
    }

    default:
      return state;
  }
}

// Se ejecuta una sola vez al montar (tercer argumento de useReducer).
// Tolera datos viejos o corruptos: descarta entradas sin _id y normaliza la cantidad.
function loadInitialItems(fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(stored)) return fallback;
    return stored
      .filter((item) => item && typeof item._id === 'string')
      .map((item) => ({ ...item, quantity: clampQuantity(item.quantity, item.stock) }));
  } catch {
    return fallback;
  }
}

// Pide cada producto del carrito a la API y arma los cambios a aplicar.
async function fetchCartUpdates(items) {
  const results = await Promise.all(
    items.map(async (item) => {
      try {
        return { item, product: await getProductById(item._id) };
      } catch (error) {
        return { item, error };
      }
    })
  );

  const updates = {};
  const removedIds = [];
  const notices = [];
  let networkError = false;

  for (const { item, product, error } of results) {
    if (product) {
      if (maxStock(product.stock) < 1) {
        removedIds.push(item._id);
        notices.push(`"${product.name}" se quitó del carrito porque se quedó sin stock.`);
        continue;
      }
      updates[item._id] = product;
      if (item.quantity > maxStock(product.stock)) {
        notices.push(`La cantidad de "${product.name}" se ajustó al stock disponible (${product.stock}).`);
      }
      if (item.price !== undefined && Number(item.price) !== Number(product.price)) {
        notices.push(`El precio de "${product.name}" se actualizó.`);
      }
    } else if (error instanceof TypeError) {
      // Fallo de red: no se borra nada, se puede reintentar.
      networkError = true;
    } else {
      // 404 (no existe o se desactivó) o id inválido: ya no se puede comprar.
      removedIds.push(item._id);
      notices.push(`"${item.name ?? 'Un producto'}" se quitó del carrito porque ya no está disponible.`);
    }
  }

  return { updates, removedIds, notices, networkError };
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialItems);
  // 'syncing' mientras se verifican precios y stock contra la API; 'error' si falló la red.
  const [syncStatus, setSyncStatus] = useState(() => (loadInitialItems([]).length > 0 ? 'syncing' : 'synced'));
  const [notices, setNotices] = useState([]);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const applySync = useCallback(({ updates, removedIds, notices: newNotices, networkError }) => {
    dispatch({ type: SYNC, payload: { updates, removedIds } });
    setNotices(newNotices);
    setSyncStatus(networkError ? 'error' : 'synced');
  }, []);

  // Al cargar la app (por ejemplo después de F5): revalidar lo guardado en localStorage.
  useEffect(() => {
    const stored = itemsRef.current;
    if (stored.length === 0) return undefined;
    let ignore = false;
    fetchCartUpdates(stored).then((result) => {
      if (!ignore) applySync(result);
    });
    return () => {
      ignore = true;
    };
  }, [applySync]);

  // Reintento manual (por ejemplo si falló la red).
  const refreshCart = useCallback(async () => {
    if (itemsRef.current.length === 0) return;
    setSyncStatus('syncing');
    applySync(await fetchCartUpdates(itemsRef.current));
  }, [applySync]);

  const dismissNotices = useCallback(() => setNotices([]), []);

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
      syncStatus,
      isSyncing: syncStatus === 'syncing',
      notices,
      dismissNotices,
      refreshCart,
    };
  }, [items, addItem, updateQuantity, removeItem, clearCart, getQuantity, checkout, syncStatus, notices, dismissNotices, refreshCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
