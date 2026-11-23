import express from "express";

import corsMiddleware from "./middlewares/corsMiddleware.js";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";

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

// Rutas públicas de productos y contacto
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

// Rutas inexistentes
app.use(notFoundMiddleware);

// Manejo centralizado de errores
app.use(errorMiddleware);

export default app;