import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Estilos globales de Pam: tokens, reset, base y utilidades (en ese orden).
import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'
import './styles/utilities.css'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
// TODO (Rodri): importar AuthProvider desde './contexts/AuthContext.jsx'
// y envolver <CartProvider> con <AuthProvider> cuando esté implementado.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
