
import mongoose from "mongoose";

export const validateCreateOrder = (req, res, next) => {
  const { items } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "El pedido debe contener al menos un producto",
    });
  }

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.productId !== "string" ||
      !mongoose.isValidObjectId(item.productId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Los productos o las cantidades no son válidos",
      });
    }
  }

  next();
};
