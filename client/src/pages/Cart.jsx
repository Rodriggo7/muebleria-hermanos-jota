import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import { useCart } from '../hooks/useCart.js';

import pageStyles from './Cart.module.css';
import cartStyles from '../components/cart/Cart.module.css';

function Cart() {
  const { items, isEmpty } = useCart();

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
          <CartSummary />
        </>
      )}
    </section>
  );
}

export default Cart;
