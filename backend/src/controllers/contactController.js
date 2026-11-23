import contactService from "../services/contactService.js";

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.body);

    res.status(201).json({
      success: true,
      message: "Mensaje enviado correctamente",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getContacts();

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.params.id);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await contactService.updateContactStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Estado del mensaje actualizado correctamente",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
};
