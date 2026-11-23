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

**Pendiente de montar en `app.js` e integrar con autenticación.**

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

**Pendiente de montar en `app.js` e integrar con autenticación.**

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

**Implementados en servicios, controladores y rutas; pendientes de montar en `app.js` e integrar con autenticación.**

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

## 4. Autenticación e integración

La autenticación es responsabilidad del módulo de Rodri.

Las rutas protegidas esperan que el middleware de autenticación proporcione:

```js
req.user = {
  id: "ID_DEL_USUARIO",
  role: "user"
};
```

Para administradores:

```js
req.user = {
  id: "ID_DEL_USUARIO",
  role: "admin"
};
```

El frontend debe enviar el token mediante:

```http
Authorization: Bearer TOKEN_JWT
```

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

**Nota:** Las rutas administrativas y de pedidos deben montarse en `app.js` una vez que estén disponibles los middlewares definitivos de autenticación y autorización. Los prefijos documentados deben respetarse durante la integración.
