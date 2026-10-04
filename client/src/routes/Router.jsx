import { Routes, Route } from 'react-router-dom';
import Inicio from '../pages/Inicio';
import Catalogo from '../pages/Catalogo';
import Detalle from '../pages/Detalle';
import Contacto from '../pages/Contacto';

export default function AppRouter({ carrito, setCarrito }) {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Catalogo />} />
      <Route path="/productos/:id" element={<Detalle />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  );
}