
import mongoose from "mongoose";
import orderRepository from "../repositories/orderRepository.js";
import productRepository from "../repositories/productRepository.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createOrder = async (userId, items) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("El usuario no es válido", 400);
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw createError("El pedido debe contener al menos un producto", 400);
  }

  const quantities = new Map();

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.productId !== "string" ||
      !mongoose.isValidObjectId(item.productId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw createError("Los productos o las cantidades no son válidos", 400);
    }

    const id = item.productId;
    quantities.set(id, (quantities.get(id) || 0) + item.quantity);
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];

      for (const [productId, quantity] of quantities) {
        const product = await productRepository.decrementStock(
          productId,
          quantity,
          session
        );

        if (!product) {
          throw createError(
            "Un producto no existe, está inactivo o no tiene stock suficiente",
            400
          );
        }

        const unitPrice = product.price;

        orderItems.push({
          product: product._id,
          productName: product.name,
          unitPrice,
          quantity,
          subtotal: unitPrice * quantity,
        });
      }

      const total = orderItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      createdOrder = await orderRepository.create(
        {
          user: userId,
          items: orderItems,
          total,
        },
        session
      );
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
};

export const getMyOrders = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("El usuario no es válido", 400);
  }

  return orderRepository.findByUser(userId);
};

export const getAllOrders = async () => {
  return orderRepository.findAll();
};

export const getOrderById = async (orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw createError("El identificador del pedido no es válido", 400);
  }

  const order = await orderRepository.findById(orderId);

  if (!order) {
    throw createError("Pedido no encontrado", 404);
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw createError("El identificador del pedido no es válido", 400);
  }

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw createError("El estado del pedido no es válido", 400);
  }

  const order = await orderRepository.updateStatus(orderId, status);

  if (!order) {
    throw createError("Pedido no encontrado", 404);
  }

  return order;
};

export default {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
