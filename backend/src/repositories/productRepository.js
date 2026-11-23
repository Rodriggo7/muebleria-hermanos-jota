
import Product from "../models/Product.js";

// Escapa caracteres especiales para evitar que se interpreten como regex.
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Permite encontrar coincidencias aunque se omitan las tildes.
const normalizeSearch = (value) => {
  const accentGroups = {
    a: "[aáàäâã]",
    e: "[eéèëê]",
    i: "[iíìïî]",
    o: "[oóòöôõ]",
    u: "[uúùüû]",
    n: "[nñ]",
  };

  return [...value.toLowerCase()]
    .map((character) => {
      if (accentGroups[character]) {
        return accentGroups[character];
      }

      return escapeRegex(character);
    })
    .join("");
};

export const findAll = async ({
  category,
  isActive,
  search,
} = {}) => {
  const filters = {};

  if (category) filters.category = category;

  if (typeof isActive === "boolean") {
    filters.isActive = isActive;
  }

  if (search?.trim()) {
    const searchRegex = {
      $regex: normalizeSearch(search.trim()),
      $options: "i",
    };

    filters.$or = [
      { name: searchRegex },
      { description: searchRegex },
    ];
  }

  return Product.find(filters).sort({ createdAt: -1 }).lean();
};

export const findById = async (id) => {
  return Product.findById(id).lean();
};

export const create = async (productData) => {
  const product = await Product.create(productData);
  return product.toObject();
};

export const updateById = async (id, productData) => {
  return Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deactivateById = async (id) => {
  return Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true }
  ).lean();
};

// Descuenta stock solamente si hay unidades suficientes.
export const decrementStock = async (id, quantity, session) => {
  return Product.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
      stock: { $gte: quantity },
    },
    {
      $inc: { stock: -quantity },
    },
    {
      new: true,
      runValidators: true,
      session,
    }
  ).lean();
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deactivateById,
  decrementStock,
};
