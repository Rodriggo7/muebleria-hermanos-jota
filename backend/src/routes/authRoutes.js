import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticateToken, getMe);

export default router;