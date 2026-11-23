import { describe, test, expect, jest, beforeEach } from "@jest/globals";

const mockOrderRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByUser: jest.fn(),
  findAll: jest.fn(),
  updateStatus: jest.fn(),
};

const mockProductRepository = {
  decrementStock: jest.fn(),
};

jest.unstable_mockModule("../src/repositories/orderRepository.js", () => ({
  default: mockOrderRepository,
}));

jest.unstable_mockModule("../src/repositories/productRepository.js", () => ({
  default: mockProductRepository,
}));

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = await import("../src/services/orderService.js");

const validUserId = "507f1f77bcf86cd799439011";
const validOrderId = "507f1f77bcf86cd799439012";

describe("Servicio de pedidos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rechaza un usuario con identificador inválido", async () => {
    await expect(
      createOrder("usuario-invalido", [
        { productId: validOrderId, quantity: 1 },
      ])
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("rechaza un pedido sin productos", async () => {
    await expect(
      createOrder(validUserId, [])
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("rechaza cantidades inválidas", async () => {
    await expect(
      createOrder(validUserId, [
        { productId: validOrderId, quantity: 0 },
      ])
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("rechaza un usuario inválido al consultar sus pedidos", async () => {
    await expect(
      getMyOrders("usuario-invalido")
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockOrderRepository.findByUser).not.toHaveBeenCalled();
  });

  test("obtiene los pedidos de un usuario", async () => {
    const orders = [{ _id: validOrderId, total: 150000 }];
    mockOrderRepository.findByUser.mockResolvedValue(orders);

    const result = await getMyOrders(validUserId);

    expect(mockOrderRepository.findByUser).toHaveBeenCalledWith(validUserId);
    expect(result).toEqual(orders);
  });

  test("obtiene todos los pedidos", async () => {
    mockOrderRepository.findAll.mockResolvedValue([]);

    const result = await getAllOrders();

    expect(mockOrderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  test("devuelve un error 404 si el pedido no existe", async () => {
    mockOrderRepository.findById.mockResolvedValue(null);

    await expect(
      getOrderById(validOrderId)
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("rechaza un estado de pedido inválido", async () => {
    await expect(
      updateOrderStatus(validOrderId, "estado-invalido")
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockOrderRepository.updateStatus).not.toHaveBeenCalled();
  });

  test("actualiza el estado de un pedido", async () => {
    const updatedOrder = {
      _id: validOrderId,
      status: "processing",
    };

    mockOrderRepository.updateStatus.mockResolvedValue(updatedOrder);

    const result = await updateOrderStatus(validOrderId, "processing");

    expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(
      validOrderId,
      "processing"
    );
    expect(result).toEqual(updatedOrder);
  });
});