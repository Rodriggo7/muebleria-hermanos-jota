import { describe, test, expect, jest } from "@jest/globals";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../src/validators/productValidator.js";

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("Validación de productos", () => {
  test("rechaza un producto sin datos obligatorios", () => {
    const req = { body: {} };
    const res = createResponse();
    const next = jest.fn();

    validateCreateProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("acepta un producto con datos válidos", () => {
    const req = {
      body: {
        name: "Mesa de prueba",
        description: "Mesa de madera para comedor",
        price: 150000,
        category: "comedor",
        stock: 5,
        images: [],
      },
    };
    const res = createResponse();
    const next = jest.fn();

    validateCreateProduct(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("rechaza una categoría inexistente", () => {
    const req = {
      body: {
        name: "Mesa de prueba",
        description: "Mesa de madera",
        price: 150000,
        category: "categoria-inventada",
        stock: 5,
      },
    };
    const res = createResponse();
    const next = jest.fn();

    validateCreateProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("rechaza un precio negativo", () => {
    const req = {
      body: {
        name: "Mesa de prueba",
        description: "Mesa de madera",
        price: -100,
        category: "comedor",
        stock: 5,
      },
    };
    const res = createResponse();
    const next = jest.fn();

    validateCreateProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("permite actualizar solamente el precio", () => {
    const req = { body: { price: 200000 } };
    const res = createResponse();
    const next = jest.fn();

    validateUpdateProduct(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});