import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { validateCreateOrder } from "../validators/orderValidator.js";
import validateOrderStatus from "../validators/orderStatusValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

router.use(authenticateToken);

router.post("/", validateCreateOrder, createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);

router.get("/", requireAdmin, getAllOrders);
router.patch("/:id/status", requireAdmin, validateOrderStatus, updateOrderStatus);

export default router;