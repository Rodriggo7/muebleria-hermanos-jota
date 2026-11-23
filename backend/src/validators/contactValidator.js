
const validateContact = (req, res, next) => {
  const { name, email, phone, subject, message } = req.body ?? {};
  const errors = [];

  if (typeof name !== "string" || !name.trim()) {
    errors.push("El nombre es obligatorio");
  } else if (name.trim().length > 100) {
    errors.push("El nombre no puede superar los 100 caracteres");
  }

  if (typeof email !== "string" || !email.trim()) {
    errors.push("El email es obligatorio");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("El email no tiene un formato válido");
  } else if (email.trim().length > 150) {
    errors.push("El email no puede superar los 150 caracteres");
  }

  if (phone !== undefined && typeof phone !== "string") {
    errors.push("El teléfono debe ser texto");
  } else if (phone && phone.trim().length > 30) {
    errors.push("El teléfono no puede superar los 30 caracteres");
  }

  if (subject !== undefined && typeof subject !== "string") {
    errors.push("El asunto debe ser texto");
  } else if (subject && subject.trim().length > 150) {
    errors.push("El asunto no puede superar los 150 caracteres");
  }

  if (typeof message !== "string" || !message.trim()) {
    errors.push("El mensaje es obligatorio");
  } else if (message.trim().length > 3000) {
    errors.push("El mensaje no puede superar los 3000 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Los datos del contacto no son válidos",
      errors,
    });
  }

  next();
};

export default validateContact;
