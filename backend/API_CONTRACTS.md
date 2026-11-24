# Contratos de API — Mueblería Hermanos Jota

**Base URL local:** `http://localhost:4000/api`

**Formato:** JSON (`Content-Type: application/json`).

## 1. Productos

### Listar productos

`GET /products`

Devuelve los productos activos.

Parámetros opcionales:
- `category`: filtra por categoría.
- `search`: busca por nombre o descripción.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "ID_DEL_PRODUCTO",
      "name": "Mesa de comedor",
      "description": "Mesa de madera",
      "price": 150000,
      "category": "comedor",
      "stock": 5,
      "images": [],
      "isActive": true
    }
  ]
}
```

### Listar categorías

`GET /products/categories`

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    { "value": "living", "label": "Living" },
    { "value": "comedor", "label": "Comedor" },
    { "value": "dormitorio", "label": "Dormitorio" },
    { "value": "oficina", "label": "Oficina" },
    { "value": "exterior", "label": "Exterior" },
    { "value": "decoracion", "label": "Decoración" }
  ]
}
```

### Obtener producto

`GET /products/:id`

Respuesta `200`: objeto del producto dentro de `data`.

Respuesta `404`: producto inexistente.

### Administración de productos

Prefijo previsto: `/admin/products`.

| Método | Ruta | Acción |
|---|---|---|
| POST | `/admin/products` | Crear producto |
| PUT | `/admin/products/:id` | Actualizar producto |
| PATCH | `/admin/products/:id/deactivate` | Desactivar producto |

Requieren usuario autenticado con rol administrador.

Cuerpo para crear:

```json
{
  "name": "Mesa de comedor",
  "description": "Mesa de madera",
  "price": 150000,
  "category": "comedor",
  "stock": 5,
  "images": []
}
```

La actualización acepta campos parciales.

## 2. Contacto

### Enviar mensaje

`POST /contact`

Ruta pública.

Cuerpo:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "1122334455",
  "subject": "Consulta por un producto",
  "message": "Quisiera recibir más información."
}
```

Respuesta `201`:

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "data": {
    "_id": "ID_DEL_CONTACTO",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "status": "pending"
  }
}
```

### Administración de contactos

Prefijo previsto: `/admin/contacts`.

| Método | Ruta | Acción |
|---|---|---|
| GET | `/admin/contacts` | Listar mensajes |
| GET | `/admin/contacts/:id` | Obtener mensaje |
| PATCH | `/admin/contacts/:id/status` | Actualizar estado |

Requieren usuario autenticado con rol administrador.

Cuerpo para actualizar estado:

```json
{
  "status": "read"
}
```

Estados admitidos: `pending`, `read`, `answered`.

## 3. Pedidos

Prefijo: `/orders`.

Todas las rutas requieren autenticación.

### Crear pedido

`POST /orders`

Cuerpo:

```json
{
  "items": [
    {
      "productId": "ID_DEL_PRODUCTO",
      "quantity": 2
    }
  ]
}
```

El usuario se obtiene del token, no del cuerpo de la petición.

Respuesta `201`:

```json
{
  "success": true,
  "message": "Pedido creado correctamente",
  "data": {
    "user": "ID_DEL_USUARIO",
    "items": [
      {
        "product": "ID_DEL_PRODUCTO",
        "productName": "Mesa de comedor",
        "unitPrice": 150000,
        "quantity": 2,
        "subtotal": 300000
      }
    ],
    "total": 300000,
    "status": "pending"
  }
}
```

El backend agrupa productos repetidos, verifica el stock y descuenta las cantidades dentro de una transacción. Si la operación falla, no debe guardarse el pedido ni mantenerse un descuento parcial de stock.

### Consultar pedidos propios

`GET /orders/my-orders`

Devuelve los pedidos del usuario autenticado.

### Consultar pedido por ID

`GET /orders/:id`

El usuario puede consultar sus propios pedidos. Los administradores pueden consultar cualquiera.

### Listar todos los pedidos

`GET /orders`

Requiere rol administrador.

### Actualizar estado

`PATCH /orders/:id/status`

Requiere rol administrador.

Cuerpo:

```json
{
  "status": "processing"
}
```

Estados admitidos:

- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

## 4. Autenticación, Usuarios y Administración

Todas las contraseñas se almacenan encriptadas mediante `bcrypt` y **nunca** se devuelven en las respuestas de la API.

El frontend debe enviar el token en las rutas protegidas mediante:

```http
Authorization: Bearer TOKEN_JWT
```

El middleware `authenticateToken` valida el JWT, verifica en base de datos que la cuenta exista y permanezca activa (`isActive: true`) y expone en cada solicitud protegida:

```js
req.user = {
  id: "ID_DEL_USUARIO",
  role: "user" // o "admin"
};
```

### 4.1. Autenticación (/auth)

| Método | Ruta | Acceso | Acción |
|---|---|---|---|
| POST | `/auth/register` | Público | Registrar usuario (asigna rol `user` por defecto) |
| POST | `/auth/login` | Público | Iniciar sesión y obtener JWT |
| GET | `/auth/me` | Autenticado | Obtener los datos del usuario autenticado actual |

#### Registrar usuario — POST /auth/register

Cuerpo:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "phone": "1122334455"
}
```

`phone` es opcional. Cualquier campo `role` enviado en el cuerpo es ignorado por seguridad.

Respuesta `201`:

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "_id": "ID_DEL_USUARIO",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "phone": "1122334455",
      "isActive": true
    },
    "token": "TOKEN_JWT"
  }
}
```

Errores posibles: `400` (datos inválidos), `409` (correo ya registrado).

#### Iniciar sesión — POST /auth/login

Cuerpo:

```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

Respuesta `200`:

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "_id": "ID_DEL_USUARIO",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "phone": "1122334455",
      "isActive": true
    },
    "token": "TOKEN_JWT"
  }
}
```

Errores posibles: `400` (formato inválido), `401` (credenciales inválidas o cuenta desactivada).

#### Obtener sesión actual — GET /auth/me

Requiere `Authorization: Bearer TOKEN_JWT`.

Respuesta `200`: objeto del usuario autenticado dentro de `data` (sin `password`).

### 4.2. Perfil de usuario (/users)

Todas las rutas requieren autenticación (`authenticateToken`).

| Método | Ruta | Acción |
|---|---|---|
| GET | `/users/profile` | Obtener perfil del usuario autenticado |
| PUT | `/users/profile` | Actualizar datos básicos (`name`, `phone`) |

Cuerpo para actualizar perfil (`PUT /users/profile`):

```json
{
  "name": "Juan Carlos Pérez",
  "phone": "1199887766"
}
```

Solo se admiten `name` y `phone`. No permite modificar `role`, `email`, `password` ni `isActive`.

### 4.3. Administración de usuarios (/admin/users)

Todas las rutas requieren autenticación y rol administrador (`authenticateToken` + `requireAdmin`).

| Método | Ruta | Acción |
|---|---|---|
| GET | `/admin/users` | Listar usuarios (filtros opcionales `?role=user\|admin&isActive=true\|false`) |
| GET | `/admin/users/:id` | Obtener usuario por ID |
| PATCH | `/admin/users/:id/role` | Modificar rol de un usuario (`user` o `admin`) |
| PATCH | `/admin/users/:id/deactivate` | Desactivar cuenta de usuario (baja lógica `isActive: false`) |

Cuerpo para cambiar rol (`PATCH /admin/users/:id/role`):

```json
{
  "role": "admin"
}
```

Reglas de protección: un administrador no puede modificar su propio rol ni desactivar su propia cuenta (`400`).

### 4.4. Variables de entorno y creación de administrador inicial

Variables requeridas en `backend/.env` (documentadas sin valores reales en `backend/.env.example`):

- `JWT_SECRET`: clave secreta para firma y verificación de tokens JWT.
- `JWT_EXPIRES_IN`: tiempo de expiración del token (por defecto `7d`).
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: credenciales para inicializar el primer administrador mediante:

```bash
npm run seed:admin
```

El script es idempotente: si el correo ya existe en la base de datos no realiza cambios.

---

## 5. Formato de errores

Las respuestas de error deben conservar el formato centralizado del backend. Ejemplo:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

Códigos utilizados:
- `400`: datos inválidos o solicitud incorrecta.
- `401`: falta autenticación o token inválido.
- `403`: usuario sin permisos.
- `404`: recurso inexistente.
- `409`: conflicto de recurso duplicado (ej. correo electrónico ya registrado).
- `500`: error interno del servidor.

## 6. Responsabilidades de integración

| Módulo | Responsable |
|---|---|
| Productos, categorías y lógica de pedidos | Pablo |
| Contacto y contratos de negocio | Pablo |
| Registro, login, JWT y autorización | Rodri |
| Frontend público, navegación y carrito | Maxi |
| Diseño visual y CSS | Pam |
| Integración final y entrega | Mateo |
