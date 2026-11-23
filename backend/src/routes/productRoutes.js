import { Router } from "express";

import {
  getCategories,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = Router();

// Consultar categorías
router.get("/categories", getCategories);

// Listar productos
router.get("/", getProducts);

// Consultar un producto por ID
router.get("/:id", getProductById);

export default router;