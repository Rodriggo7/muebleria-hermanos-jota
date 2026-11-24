import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
} from "../controllers/userController.js";
import { validateUpdateRole } from "../validators/userValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

// Todas las operaciones administrativas requieren autenticación y rol admin.
router.use(authenticateToken, requireAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", validateUpdateRole, updateUserRole);
router.patch("/:id/deactivate", deactivateUser);

export default router;