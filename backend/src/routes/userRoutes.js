import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { validateUpdateProfile } from "../validators/userValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las operaciones de perfil requieren usuario autenticado.
router.use(authenticateToken);

router.get("/profile", getProfile);
router.put("/profile", validateUpdateProfile, updateProfile);

export default router;