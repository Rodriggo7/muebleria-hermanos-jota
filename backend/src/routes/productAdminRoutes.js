
import { Router } from "express";

import {
  createProduct,
  updateProduct,
  deactivateProduct,
} from "../controllers/productController.js";

import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/productValidator.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

// Todas las operaciones requieren autenticación y rol administrador.
router.use(authenticateToken, requireAdmin);

// Crear producto
router.post("/", validateCreateProduct, createProduct);

// Actualizar producto
router.put("/:id", validateUpdateProduct, updateProduct);

// Desactivar producto
router.patch("/:id/deactivate", deactivateProduct);

export default router;
