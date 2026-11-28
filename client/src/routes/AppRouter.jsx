import { Navigate, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import Home from '../pages/Home.jsx';
import Products from '../pages/Products.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import Contact from '../pages/Contact.jsx';
import Cart from '../pages/Cart.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Profile from '../pages/Profile.jsx';
import MyOrders from '../pages/MyOrders.jsx';
import AdminProducts from '../pages/admin/AdminProducts.jsx';
import NewProduct from '../pages/admin/NewProduct.jsx';
import EditProduct from '../pages/admin/EditProduct.jsx';
import ProtectedRoute from '../components/routes/ProtectedRoute.jsx';
import AdminRoute from '../components/routes/AdminRoute.jsx';

// Estructura de rutas preparada originalmente por Rodri.
// Las páginas públicas y de autenticación ya están integradas.
// Perfil y pedidos requieren una sesión autenticada.
// Administración requiere una sesión autenticada con rol de administrador.

function NotFound() {
  return <h1>Página no encontrada</h1>;
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/carrito" element={<Cart />} />

        {/* Rutas públicas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas protegidas: requieren ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-pedidos" element={<MyOrders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Administración: requiere AdminRoute y AdminLayout. */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="productos" replace />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="productos/nuevo" element={<NewProduct />} />
          <Route path="productos/:id/editar" element={<EditProduct />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;