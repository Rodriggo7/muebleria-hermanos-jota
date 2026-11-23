
import mongoose from "mongoose";
import contactRepository from "../repositories/contactRepository.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createContact = async (data = {}) => {
  const { name, email, phone, subject, message } = data;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    throw createError("Nombre, correo y mensaje son obligatorios", 400);
  }

  if (
    (phone !== undefined && typeof phone !== "string") ||
    (subject !== undefined && typeof subject !== "string")
  ) {
    throw createError("El teléfono y el asunto deben ser textos", 400);
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone?.trim() || "";
  const normalizedSubject = subject?.trim() || "Consulta general";
  const normalizedMessage = message.trim();

  const fields = [
    { value: normalizedName, max: 100, label: "El nombre" },
    { value: normalizedEmail, max: 150, label: "El correo electrónico" },
    { value: normalizedPhone, max: 30, label: "El teléfono" },
    { value: normalizedSubject, max: 150, label: "El asunto" },
    { value: normalizedMessage, max: 3000, label: "El mensaje" },
  ];

  for (const field of fields) {
    if (field.value.length > field.max) {
      throw createError(
        `${field.label} no puede superar los ${field.max} caracteres`,
        400
      );
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw createError("El correo electrónico no es válido", 400);
  }

  return contactRepository.create({
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    subject: normalizedSubject,
    message: normalizedMessage,
  });
};

export const getContacts = async () => {
  return contactRepository.findAll();
};

export const getContactById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("El identificador del mensaje no es válido", 400);
  }

  const contact = await contactRepository.findById(id);

  if (!contact) {
    throw createError("Mensaje no encontrado", 404);
  }

  return contact;
};

export const updateContactStatus = async (id, status) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("El identificador del mensaje no es válido", 400);
  }

  const validStatuses = ["pending", "read", "answered"];

  if (!validStatuses.includes(status)) {
    throw createError("El estado del mensaje no es válido", 400);
  }

  const contact = await contactRepository.updateStatus(id, status);

  if (!contact) {
    throw createError("Mensaje no encontrado", 404);
  }

  return contact;
};

export default {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
};
