import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './routes/Router';

export default function App() {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
  };

  return (
    <BrowserRouter>
      <Navbar cartCount={carrito.length} />
      <AppRouter carrito={carrito} onAddToCart={agregarAlCarrito} />
      <Footer />
    </BrowserRouter>
  );
}