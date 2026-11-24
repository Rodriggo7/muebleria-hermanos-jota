import express from "express";

import corsMiddleware from "./middlewares/corsMiddleware.js";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userAdminRoutes from "./routes/userAdminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import contactAdminRoutes from "./routes/contactAdminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productAdminRoutes from "./routes/productAdminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middlewares generales
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(loggerMiddleware);

// Comprobación del estado de la API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Mueblería Hermanos Jota funcionando correctamente",
  });
});

// Rutas de autenticación y usuarios
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Rutas públicas de productos y contacto
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

// Rutas protegidas de pedidos
app.use("/api/orders", orderRoutes);

// Rutas administrativas
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/contacts", contactAdminRoutes);

// Rutas inexistentes
app.use(notFoundMiddleware);

// Manejo centralizado de errores
app.use(errorMiddleware);

export default app;