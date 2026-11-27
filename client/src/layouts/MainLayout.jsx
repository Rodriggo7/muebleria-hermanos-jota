import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
