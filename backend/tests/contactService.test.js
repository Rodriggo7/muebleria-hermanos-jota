import { describe, test, expect, jest, beforeEach } from "@jest/globals";

const mockContactRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
};

jest.unstable_mockModule("../src/repositories/contactRepository.js", () => ({
  default: mockContactRepository,
}));

const {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
} = await import("../src/services/contactService.js");

const validId = "507f1f77bcf86cd799439011";

describe("Servicio de contacto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rechaza un mensaje sin nombre, correo o contenido", async () => {
    await expect(
      createContact({})
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockContactRepository.create).not.toHaveBeenCalled();
  });

  test("rechaza un correo electrónico inválido", async () => {
    await expect(
      createContact({
        name: "Usuario de prueba",
        email: "correo-invalido",
        message: "Quiero consultar por un producto",
      })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockContactRepository.create).not.toHaveBeenCalled();
  });

  test("rechaza teléfono de tipo incorrecto", async () => {
    await expect(
      createContact({
        name: "Usuario de prueba",
        email: "prueba@gmail.com",
        phone: 123456,
        message: "Consulta de prueba",
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("crea un contacto y normaliza el correo", async () => {
    mockContactRepository.create.mockImplementation(async (data) => data);

    const result = await createContact({
      name: " Usuario de prueba ",
      email: " PRUEBA@GMAIL.COM ",
      phone: " 1122334455 ",
      message: " Consulta por una mesa ",
    });

    expect(mockContactRepository.create).toHaveBeenCalledWith({
      name: "Usuario de prueba",
      email: "prueba@gmail.com",
      phone: "1122334455",
      subject: "Consulta general",
      message: "Consulta por una mesa",
    });

    expect(result.email).toBe("prueba@gmail.com");
  });

  test("obtiene todos los mensajes de contacto", async () => {
    mockContactRepository.findAll.mockResolvedValue([]);

    const result = await getContacts();

    expect(mockContactRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  test("rechaza un identificador de contacto inválido", async () => {
    await expect(
      getContactById("identificador-invalido")
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockContactRepository.findById).not.toHaveBeenCalled();
  });

  test("devuelve error 404 si el mensaje no existe", async () => {
    mockContactRepository.findById.mockResolvedValue(null);

    await expect(
      getContactById(validId)
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("rechaza un estado de contacto inválido", async () => {
    await expect(
      updateContactStatus(validId, "estado-invalido")
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(mockContactRepository.updateStatus).not.toHaveBeenCalled();
  });

  test("actualiza el estado de un mensaje", async () => {
    const updatedContact = {
      _id: validId,
      status: "answered",
    };

    mockContactRepository.updateStatus.mockResolvedValue(updatedContact);

    const result = await updateContactStatus(validId, "answered");

    expect(mockContactRepository.updateStatus).toHaveBeenCalledWith(
      validId,
      "answered"
    );

    expect(result).toEqual(updatedContact);
  });
});