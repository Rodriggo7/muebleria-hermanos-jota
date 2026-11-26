import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';
import Products from '../pages/Products.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import Contact from '../pages/Contact.jsx';
import Cart from '../pages/Cart.jsx';
// TODO (Rodri): importar Login, Register, Profile, MyOrders, ProtectedRoute,
// AdminRoute, AdminLayout y las páginas de admin.

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

        {/* TODO (Rodri): rutas públicas de autenticación */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/registro" element={<Register />} /> */}

        {/* TODO (Rodri): rutas protegidas, envueltas en ProtectedRoute */}
        {/* <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Profile />} />
              <Route path="/mis-pedidos" element={<MyOrders />} />
            </Route> */}

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* TODO (Rodri): rutas de admin, con AdminRoute y AdminLayout */}
      {/* <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="productos" element={<AdminProducts />} />
              <Route path="productos/nuevo" element={<NewProduct />} />
              <Route path="productos/:id/editar" element={<EditProduct />} />
            </Route>
          </Route> */}
    </Routes>
  );
}

export default AppRouter;
