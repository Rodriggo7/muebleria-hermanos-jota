import mongoose from "mongoose";
import productRepository from "../repositories/productRepository.js";
import { isValidProductCategory } from "../constants/productCategories.js";

const PRODUCT_FIELDS = [
  "name",
  "description",
  "price",
  "category",
  "stock",
  "images",
];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("El identificador del producto no es válido", 400);
  }
};

const validateCategory = (category) => {
  if (!isValidProductCategory(category)) {
    throw createError("La categoría seleccionada no es válida", 400);
  }
};

const extractProductFields = (data) => {
  const unknownFields = Object.keys(data).filter(
    (field) => !PRODUCT_FIELDS.includes(field)
  );

  if (unknownFields.length > 0) {
    throw createError(
      `Campos no permitidos: ${unknownFields.join(", ")}`,
      400
    );
  }

  return Object.fromEntries(
    Object.entries(data).filter(([field]) =>
      PRODUCT_FIELDS.includes(field)
    )
  );
};

export const getProducts = async ({
  category,
  search,
  includeInactive = false,
} = {}) => {
  if (category) {
    validateCategory(category);
  }

  return productRepository.findAll({
    category,
    search,
    isActive: includeInactive ? undefined : true,
  });
};

export const getProductById = async (
  id,
  { includeInactive = false } = {}
) => {
  validateId(id);

  const product = await productRepository.findById(id);

  if (!product || (!includeInactive && !product.isActive)) {
    throw createError("Producto no encontrado", 404);
  }

  return product;
};

export const createProduct = async (data) => {
  const productData = extractProductFields(data);

  if (productData.category) {
    validateCategory(productData.category);
  }

  return productRepository.create(productData);
};

export const updateProduct = async (id, data) => {
  validateId(id);

  const existingProduct = await productRepository.findById(id);

  if (!existingProduct || !existingProduct.isActive) {
    throw createError("Producto no encontrado", 404);
  }

  const productData = extractProductFields(data);

  if (Object.keys(productData).length === 0) {
    throw createError("No se recibieron datos para actualizar", 400);
  }

  if (productData.category !== undefined) {
    validateCategory(productData.category);
  }

  return productRepository.updateById(id, productData);
};

export const deactivateProduct = async (id) => {
  validateId(id);

  const existingProduct = await productRepository.findById(id);

  if (!existingProduct || !existingProduct.isActive) {
    throw createError("Producto no encontrado", 404);
  }

  return productRepository.deactivateById(id);
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
};
