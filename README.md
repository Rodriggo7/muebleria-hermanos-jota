# Backend — Mueblería Hermanos Jota

API REST desarrollada con Node.js, Express y MongoDB mediante Mongoose.

## 1. Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Jest
- Supertest

## 2. Instalación

Desde la carpeta raíz del proyecto:

```powershell
npm install --prefix .\backend
```

## 3. Variables de entorno

Crear un archivo `.env` dentro de `backend/`, tomando como referencia `.env.example`.

Configurar:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/hermanos_jota
JWT_SECRET=colocar_un_secreto_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Reemplazar los valores de ejemplo por las credenciales correspondientes.

**Importante:** no subir `.env` ni compartir contraseñas o secretos en el repositorio.

## 4. Ejecutar el servidor

Desde la carpeta raíz:

```powershell
npm run dev --prefix .\backend
```

El servidor se ejecuta en:

`http://localhost:4000`

Comprobar su funcionamiento:

`http://localhost:4000/api/health`

Respuesta esperada:

```json
{
  "success": true,
  "message": "API de Mueblería Hermanos Jota funcionando correctamente"
}
```

## 5. Cargar datos iniciales

Para ejecutar el script de carga de productos:

```powershell
npm run seed --prefix .\backend
```

El script carga los productos iniciales en MongoDB.

## 6. Rutas disponibles

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos activos |
| GET | `/api/products/categories` | Listar categorías |
| GET | `/api/products/:id` | Obtener producto por ID |

Filtros disponibles para productos:

- `category`: filtrar por categoría.
- `search`: buscar por nombre o descripción.

Ejemplo:

`GET /api/products?category=comedor`

### Contacto

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/contact` | Enviar mensaje de contacto |

### Pedidos y administración

Los servicios, controladores y rutas de pedidos y administración están desarrollados, pero su montaje en `app.js` queda pendiente de la integración con los middlewares definitivos de autenticación y autorización.

Consultar `API_CONTRACTS.md` para conocer sus contratos.

## 7. Pruebas

Ejecutar las pruebas del backend:

```powershell
npm test --prefix .\backend -- --runInBand
```

Las pruebas cubren validaciones y lógica de productos, pedidos y contactos, incluida la creación transaccional de pedidos.

**Nota de integración:** `auth.test.js` todavía está pendiente de implementación por el responsable del módulo de autenticación. Hasta entonces, Jest puede informar un fallo por suite vacía aunque las demás pruebas pasen.

## 8. Estructura del backend

```text
backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── jest.config.js
├── package.json
└── README.md
```

## 9. Documentación relacionada

- `API_CONTRACTS.md`: endpoints, parámetros, cuerpos de petición, respuestas y requisitos de autenticación.
- `.env.example`: variables de entorno necesarias para configurar el proyecto.

## 10. Responsabilidades

- Productos, categorías y lógica de pedidos: Pablo.
- Autenticación, registro, login, JWT y autorización: Rodri.
- Integración final: Mateo.

Los módulos deben respetar los contratos de `API_CONTRACTS.md` para facilitar la integración del frontend y del backend.