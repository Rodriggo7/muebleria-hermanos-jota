import productService from "../services/productService.js";
import { PRODUCT_CATEGORIES } from "../constants/productCategories.js";

export const getCategories = (req, res) => {
  res.status(200).json({
    success: true,
    data: PRODUCT_CATEGORIES,
  });
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const products = await productService.getProducts({
      category,
      search,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Producto actualizado correctamente",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateProduct = async (req, res, next) => {
  try {
    const product = await productService.deactivateProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Producto desactivado correctamente",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
