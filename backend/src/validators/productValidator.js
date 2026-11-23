
import { isValidProductCategory } from "../constants/productCategories.js";

const validateProduct = (req, res, next, isUpdate = false) => {
  const { name, description, price, category, stock, images } = req.body;

  const errors = [];

  if (!isUpdate || name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      errors.push("El nombre es obligatorio y debe ser texto");
    } else if (name.trim().length > 120) {
      errors.push("El nombre no puede superar los 120 caracteres");
    }
  }

  if (!isUpdate || description !== undefined) {
    if (typeof description !== "string" || !description.trim()) {
      errors.push("La descripción es obligatoria y debe ser texto");
    } else if (description.trim().length > 2000) {
      errors.push("La descripción no puede superar los 2000 caracteres");
    }
  }

  if (!isUpdate || price !== undefined) {
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      errors.push("El precio debe ser un número mayor o igual a cero");
    }
  }

  if (!isUpdate || category !== undefined) {
    if (typeof category !== "string" || !isValidProductCategory(category)) {
      errors.push("La categoría seleccionada no es válida");
    }
  }

  if (!isUpdate || stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0) {
      errors.push("El stock debe ser un número entero mayor o igual a cero");
    }
  }

  if (images !== undefined) {
    if (
      !Array.isArray(images) ||
      !images.every((image) => typeof image === "string")
    ) {
      errors.push("Las imágenes deben enviarse como una lista de textos");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Los datos del producto no son válidos",
      errors,
    });
  }

  next();
};

export const validateCreateProduct = (req, res, next) => {
  validateProduct(req, res, next);
};

export const validateUpdateProduct = (req, res, next) => {
  validateProduct(req, res, next, true);
};

export default {
  validateCreateProduct,
  validateUpdateProduct,
};
