
import { jest } from "@jest/globals";

const mockSession = {
  withTransaction: jest.fn(async (callback) => callback()),
  endSession: jest.fn().mockResolvedValue(undefined),
};

const mockMongoose = {
  isValidObjectId: jest.fn((id) =>
    typeof id === "string" && /^[a-f\d]{24}$/i.test(id)
  ),
  startSession: jest.fn().mockResolvedValue(mockSession),
};

const mockOrderRepository = {
  create: jest.fn(),
};

const mockProductRepository = {
  decrementStock: jest.fn(),
};

jest.unstable_mockModule("mongoose", () => ({
  default: mockMongoose,
}));

jest.unstable_mockModule("../src/repositories/orderRepository.js", () => ({
  default: mockOrderRepository,
}));

jest.unstable_mockModule("../src/repositories/productRepository.js", () => ({
  default: mockProductRepository,
}));

const { createOrder } = await import("../src/services/orderService.js");

const userId = "507f1f77bcf86cd799439011";
const productId = "507f1f77bcf86cd799439022";

describe("orderService - creación transaccional", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("crea un pedido, calcula el total y descuenta el stock", async () => {
    mockProductRepository.decrementStock.mockResolvedValue({
      _id: productId,
      name: "Mesa de comedor",
      price: 100,
    });

    mockOrderRepository.create.mockImplementation(async (orderData) => ({
      _id: "507f1f77bcf86cd799439033",
      ...orderData,
    }));

    const result = await createOrder(userId, [
      { productId, quantity: 2 },
    ]);

    expect(mockProductRepository.decrementStock).toHaveBeenCalledWith(
      productId,
      2,
      mockSession
    );

    expect(mockOrderRepository.create).toHaveBeenCalledWith(
      {
        user: userId,
        items: [
          {
            product: productId,
            productName: "Mesa de comedor",
            unitPrice: 100,
            quantity: 2,
            subtotal: 200,
          },
        ],
        total: 200,
      },
      mockSession
    );

    expect(result.total).toBe(200);
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  test("agrupa productos repetidos y suma sus cantidades", async () => {
    mockProductRepository.decrementStock.mockResolvedValue({
      _id: productId,
      name: "Mesa de comedor",
      price: 100,
    });

    mockOrderRepository.create.mockImplementation(async (orderData) => orderData);

    await createOrder(userId, [
      { productId, quantity: 1 },
      { productId, quantity: 2 },
    ]);

    expect(mockProductRepository.decrementStock).toHaveBeenCalledTimes(1);
    expect(mockProductRepository.decrementStock).toHaveBeenCalledWith(
      productId,
      3,
      mockSession
    );

    expect(mockOrderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 300,
        items: [
          expect.objectContaining({
            quantity: 3,
            subtotal: 300,
          }),
        ],
      }),
      mockSession
    );
  });

  test("rechaza el pedido si no hay stock suficiente", async () => {
    mockProductRepository.decrementStock.mockResolvedValue(null);

    await expect(
      createOrder(userId, [{ productId, quantity: 5 }])
    ).rejects.toThrow(
      "Un producto no existe, está inactivo o no tiene stock suficiente"
    );

    expect(mockOrderRepository.create).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
