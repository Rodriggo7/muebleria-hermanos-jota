# Mueblería Hermanos Jota

Aplicación web para la gestión y comercialización de muebles. El proyecto contempla un frontend desarrollado con React y una API REST desarrollada con Node.js, Express y MongoDB.

## Estado del proyecto

- **Backend:** implementado, integrado con MongoDB y con pruebas automatizadas.
- **Frontend:** estructura inicial creada; desarrollo de interfaces y funcionalidades en curso.
- **Integración y despliegue:** pendientes de la etapa final del proyecto.

## Tecnologías

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Jest
- Supertest

### Frontend
- React
- Vite
- React Router

## Estructura del proyecto

```text
muebleria-hermanos-jota/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Instalación

Los comandos se ejecutan desde la carpeta raíz del proyecto.

Instalar las dependencias del backend:

```powershell
npm install --prefix .\backend
```

Instalar las dependencias del frontend:

```powershell
npm install --prefix .\client
```

## Configuración del backend

Crear un archivo `.env` dentro de la carpeta `backend/`, tomando como referencia `backend/.env.example`.

Configurar las siguientes variables:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/hermanos_jota
JWT_SECRET=colocar_un_secreto_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Administrador Hermanos Jota
ADMIN_EMAIL=admin@hermanosjota.com.ar
ADMIN_PASSWORD=cambiar_por_password_seguro
```

Reemplazar los valores de ejemplo por las credenciales correspondientes.

**Importante:** no subir archivos `.env` al repositorio ni compartir contraseñas, credenciales o secretos.

## Ejecución

### Backend

Desde la carpeta raíz:

```powershell
npm run dev --prefix .\backend
```

El servidor se ejecuta en:

`http://localhost:4000`

Para comprobar su funcionamiento:

`http://localhost:4000/api/health`

### Frontend

Desde la carpeta raíz:

```powershell
npm run dev --prefix .\client
```

Vite utiliza el puerto `5173` por defecto.

## Datos iniciales

### Productos

Para cargar los productos iniciales en MongoDB:

```powershell
npm run seed --prefix .\backend
```

El script evita agregar duplicados cuando la colección ya contiene productos.

### Administrador

Para crear el usuario administrador inicial:

```powershell
npm run seed:admin --prefix .\backend
```

La creación requiere configurar `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el archivo `.env`.

Si el usuario ya existe, el script no lo modifica.

## Funcionalidades del backend

- Gestión de productos y categorías.
- Consulta de productos activos.
- Búsqueda y filtrado de productos.
- Creación, actualización y desactivación de productos.
- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Protección de rutas privadas.
- Control de acceso según roles.
- Consulta y actualización del perfil de usuario.
- Creación y consulta de pedidos.
- Asociación de pedidos con usuarios autenticados.
- Descuento de stock mediante operaciones transaccionales.
- Consulta y administración de pedidos.
- Recepción y administración de mensajes de contacto.

## Pruebas

Ejecutar las pruebas automatizadas del backend:

```powershell
npm test --prefix .\backend -- --runInBand
```

Último resultado de ejecución:

- 6 suites aprobadas.
- 55 pruebas aprobadas.
- 0 pruebas fallidas.

Las pruebas cubren autenticación, productos, pedidos, lógica de negocio, contactos y operaciones transaccionales.

## Documentación de la API

Los contratos de los endpoints, métodos HTTP, parámetros, datos esperados y requisitos de autenticación se encuentran documentados en:

`backend/API_CONTRACTS.md`

## Seguridad

- Las contraseñas se almacenan mediante hash de bcrypt.
- La autenticación utiliza tokens JWT.
- Las rutas privadas requieren autenticación.
- Las operaciones administrativas requieren permisos de administrador.
- Las credenciales y secretos se configuran mediante variables de entorno.
- Los archivos `.env` están excluidos del repositorio mediante `.gitignore`.