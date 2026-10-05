# Mueblería Hermanos Jota — Plataforma E-commerce

Plataforma e-commerce interactiva desarrollada bajo una arquitectura cliente-servidor desacoplada. El sistema se compone de una **API REST** construida en Node.js/Express para la gestión del catálogo de productos y de una **aplicación de página única (SPA)** desarrollada en React con Vite, estilizada conforme al Manual de Marca oficial de Hermanos Jota.

---

## 🛠️ Tecnologías utilizadas

- **Backend:** Node.js, Express.js, CORS, middlewares propios (logger, 404, errores), ES Modules.
- **Frontend:** React 18, Vite, React Router DOM (v6), CSS puro por componente.
- **Diseño e identidad visual:** paleta cromática oficial (Siena Tostado, Alabastro Cálido, Verde Salvia, Vara de Oro), tipografías *Playfair Display* e *Inter*, íconos Google Material Symbols.

---

## 📁 Estructura del repositorio

```plaintext
.
├── backend/
│   ├── mockup/            # Datos locales de los 11 productos
│   ├── services/          # Lógica de búsqueda de productos
│   ├── middlewares/       # logger, cors, notFound, errorHandler
│   ├── controllers/       # Controladores del catálogo y el detalle
│   ├── routes/            # Enrutador modular (express.Router)
│   └── server.js          # Servidor principal
└── client/
    ├── public/assets/     # Logo e imágenes de productos
    └── src/
        ├── components/    # Navbar, Footer, ProductCard, ProductList, ProductDetail, ContactForm
        ├── pages/         # Inicio, Catálogo, Detalle, Contacto
        ├── routes/        # Router.jsx
        ├── services/      # productService.js
        └── App.jsx        # Estado global del carrito
```

---

## 🚀 Instalación y ejecución local

El repositorio está dividido en dos carpetas principales: `/backend` y `/client`. Hay que levantar **ambas**, cada una en su propia terminal.

### 1. Servidor backend (API REST)

1. Abrir una terminal y navegar a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

- **Puerto de ejecución:** `http://localhost:3001`
- **Endpoints principales:**

  | Método | Endpoint | Descripción |
  |---|---|---|
  | GET | `/api/productos` | Devuelve el listado completo de los 11 productos. |
  | GET | `/api/productos/:id` | Devuelve el detalle de un producto o HTTP 404 si el ID no existe. |

### 2. Cliente frontend (React SPA)

1. Abrir una segunda terminal y navegar a la carpeta del cliente:

   ```bash
   cd client
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo de Vite:

   ```bash
   npm run dev
   ```

- **Puerto de ejecución:** `http://localhost:5173`

> ⚠️ Para ver el catálogo, el backend debe estar corriendo en el puerto 3001.

---

## 📐 Decisiones de arquitectura

- **Desacoplamiento cliente-servidor:** separación estricta entre la lógica de negocio y datos (`/backend`) y la interfaz de usuario (`/client`).
- **Capa de servicios en el frontend** (`src/services/productService.js`): las llamadas `fetch` están encapsuladas y separadas de los componentes visuales, lo que facilita el mantenimiento y las pruebas.
- **State Lifting para el carrito:** el estado del carrito está centralizado en `App.jsx`, lo que permite actualizar en tiempo real el contador del `Navbar` desde el catálogo o la vista de detalle.
- **Modularización de estilos:** un archivo CSS dedicado por cada componente y página, evitando archivos monolíticos y garantizando aislamiento visual.
- **Resiliencia en la interfaz:** manejo explícito de los estados de carga, fallos de conexión con la API y una vista 404 personalizada, en el tono de comunicación de la marca.
