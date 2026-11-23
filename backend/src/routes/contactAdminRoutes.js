import { Router } from "express";
import {
  getContacts,
  getContactById,
  updateContactStatus,
} from "../controllers/contactController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get("/", getContacts);
router.get("/:id", getContactById);
router.patch("/:id/status", updateContactStatus);

export default router;