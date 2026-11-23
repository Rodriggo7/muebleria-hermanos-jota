import { describe, test, expect, jest, beforeEach } from "@jest/globals";

const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  deactivateById: jest.fn(),
};

jest.unstable_mockModule("../src/repositories/productRepository.js", () => ({
  default: mockRepository,
}));

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
} = await import("../src/services/productService.js");

const validId = "507f1f77bcf86cd799439011";

const validProduct = {
  name: "Mesa de prueba",
  description: "Mesa de madera",
  price: 150000,
  category: "comedor",
  stock: 5,
  images: [],
};

describe("Servicio de productos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("obtiene solamente productos activos por defecto", async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await getProducts();

    expect(mockRepository.findAll).toHaveBeenCalledWith({
      category: undefined,
      search: undefined,
      isActive: true,
    });
  });

  test("rechaza una categoría inexistente", async () => {
    await expect(
      getProducts({ category: "categoria-inventada" })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockRepository.findAll).not.toHaveBeenCalled();
  });

  test("rechaza un identificador inválido", async () => {
    await expect(
      getProductById("identificador-invalido")
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  test("devuelve un error 404 si el producto no existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      getProductById(validId)
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("crea un producto con datos válidos", async () => {
    mockRepository.create.mockResolvedValue(validProduct);

    const result = await createProduct(validProduct);

    expect(mockRepository.create).toHaveBeenCalledWith(validProduct);
    expect(result).toEqual(validProduct);
  });

  test("rechaza campos que no están permitidos", async () => {
    await expect(
      createProduct({
        ...validProduct,
        isAdmin: true,
      })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  test("rechaza una actualización sin datos", async () => {
    mockRepository.findById.mockResolvedValue({
      ...validProduct,
      isActive: true,
    });

    await expect(
      updateProduct(validId, {})
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockRepository.updateById).not.toHaveBeenCalled();
  });

  test("actualiza un producto existente", async () => {
    mockRepository.findById.mockResolvedValue({
      ...validProduct,
      isActive: true,
    });

    mockRepository.updateById.mockResolvedValue({
      ...validProduct,
      price: 200000,
    });

    const result = await updateProduct(validId, {
      price: 200000,
    });

    expect(mockRepository.updateById).toHaveBeenCalledWith(validId, {
      price: 200000,
    });
    expect(result.price).toBe(200000);
  });

  test("rechaza la desactivación de un producto inexistente", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      deactivateProduct(validId)
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(mockRepository.deactivateById).not.toHaveBeenCalled();
  });
});