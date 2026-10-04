import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './routes/Router';

export default function App() {
  // Estado global para el carrito de compras (State Lifting)
  const [carrito, setCarrito] = useState([]);

  return (
    <BrowserRouter>
      <Navbar cartCount={carrito.length} />
      <AppRouter carrito={carrito} setCarrito={setCarrito} />
      <Footer />
    </BrowserRouter>
  );
}