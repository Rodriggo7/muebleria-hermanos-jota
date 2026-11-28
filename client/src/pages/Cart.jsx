
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import pageStyles from './Cart.module.css';
import cartStyles from '../components/cart/Cart.module.css';

function Cart() {
  const { items, isEmpty, checkout } = useCart();
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await checkout();
      navigate('/mis-pedidos');
    } catch (err) {
      setError(err.message || 'No pudimos finalizar la compra');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className={pageStyles.cart}>
      <header className={pageStyles.cartHeader}>
        <h1 className={pageStyles.title}>Carrito</h1>
      </header>

      {isEmpty ? (
        <div className={pageStyles.empty}>
          <p>Tu carrito está vacío</p>
          <Link to="/productos">Ver el catálogo</Link>
        </div>
      ) : (
        <>
          <ul className={cartStyles.list} role="list">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </ul>
          <CartSummary
            onCheckout={handleCheckout}
            isProcessing={isProcessing}
            error={error}
          />
        </>
      )}
    </section>
  );
}

export default Cart;
