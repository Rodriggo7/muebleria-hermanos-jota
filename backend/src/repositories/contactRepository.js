import Contact from "../models/Contact.js";

export const create = async (contactData) => {
  const contact = await Contact.create(contactData);
  return contact.toObject();
};

export const findAll = async () =>
  Contact.find().sort({ createdAt: -1 }).lean();

export const findById = async (id) =>
  Contact.findById(id).lean();

export const updateStatus = async (id, status) =>
  Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).lean();

export default {
  create,
  findAll,
  findById,
  updateStatus,
};
