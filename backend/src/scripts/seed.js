
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/database.js";
import Product from "../models/Product.js";

const initialProducts = [
  {
    name: "Sofá Nórdico 3 Cuerpos",
    description: "Sofá de tres cuerpos con diseño nórdico y tapizado en tela de alta calidad.",
    price: 450000,
    category: "living",
    stock: 8,
    images: [],
  },
  {
    name: "Mesa de Comedor Roble",
    description: "Mesa de comedor de madera con acabado natural, ideal para reuniones familiares.",
    price: 320000,
    category: "comedor",
    stock: 5,
    images: [],
  },
  {
    name: "Cama Matrimonial Oslo",
    description: "Cama matrimonial con estructura resistente y diseño contemporáneo.",
    price: 280000,
    category: "dormitorio",
    stock: 6,
    images: [],
  },
  {
    name: "Escritorio Minimalista",
    description: "Escritorio funcional para oficina o espacio de estudio.",
    price: 175000,
    category: "oficina",
    stock: 10,
    images: [],
  },
  {
    name: "Sillón de Jardín",
    description: "Sillón de exterior resistente, pensado para patios y galerías.",
    price: 95000,
    category: "exterior",
    stock: 12,
    images: [],
  },
  {
    name: "Lámpara Decorativa",
    description: "Lámpara de diseño moderno para complementar distintos ambientes.",
    price: 65000,
    category: "decoracion",
    stock: 15,
    images: [],
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      console.log(
        `La base de datos ya contiene ${existingProducts} productos. No se agregaron duplicados.`
      );
      return;
    }

    await Product.insertMany(initialProducts);

    console.log(`${initialProducts.length} productos cargados correctamente.`);
  } catch (error) {
    console.error("Error al cargar los productos:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
