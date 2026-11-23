export const PRODUCT_CATEGORIES = [
  {
    value: "living",
    label: "Living",
  },
  {
    value: "comedor",
    label: "Comedor",
  },
  {
    value: "dormitorio",
    label: "Dormitorio",
  },
  {
    value: "oficina",
    label: "Oficina",
  },
  {
    value: "exterior",
    label: "Exterior",
  },
  {
    value: "decoracion",
    label: "Decoración",
  },
];

export const isValidProductCategory = (category) =>
  PRODUCT_CATEGORIES.some(
    (item) => item.value === category
  );
