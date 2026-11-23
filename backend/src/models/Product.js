
import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../constants/productCategories.js";

const validCategories = PRODUCT_CATEGORIES.map((item) => item.value);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      maxlength: [120, "El nombre no puede superar los 120 caracteres"],
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      maxlength: [2000, "La descripción no puede superar los 2000 caracteres"],
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },

    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      enum: {
        values: validCategories,
        message: "La categoría del producto no es válida",
      },
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero",
      },
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ category: 1, isActive: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
