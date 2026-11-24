import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
} from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import app from "../src/app.js";
import userRepository from "../src/repositories/userRepository.js";
import { ROLES } from "../src/constants/roles.js";
import { generateToken } from "../src/utils/generateToken.js";

const USER_ID = new mongoose.Types.ObjectId().toString();
const ADMIN_ID = new mongoose.Types.ObjectId().toString();
const OTHER_USER_ID = new mongoose.Types.ObjectId().toString();

let hashedPassword;

const buildUser = (overrides = {}) => ({
  _id: USER_ID,
  name: "Cliente Prueba",
  email: "cliente@hermanosjota.com.ar",
  role: ROLES.USER,
  phone: "1122334455",
  isActive: true,
  ...overrides,
});

const buildAdmin = (overrides = {}) => ({
  _id: ADMIN_ID,
  name: "Admin Prueba",
  email: "admin@hermanosjota.com.ar",
  role: ROLES.ADMIN,
  phone: "",
  isActive: true,
  ...overrides,
});

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_hermanos_jota";
  process.env.JWT_EXPIRES_IN = "1h";
  hashedPassword = await bcrypt.hash("Password123", 10);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Módulo de Autenticación (/api/auth)", () => {
  describe("POST /api/auth/register", () => {
    it("registra un usuario, hashea la contraseña, fuerza rol user y no devuelve password", async () => {
      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

      const createSpy = jest
        .spyOn(userRepository, "create")
        .mockImplementation(async (data) => ({
          _id: USER_ID,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          isActive: true,
        }));

      const res = await request(app).post("/api/auth/register").send({
        name: "  Ana Gómez  ",
        email: "ANA@Example.com",
        password: "Password123",
        role: "admin", // Intento de escalada de privilegios
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe(ROLES.USER);
      expect(res.body.data.user.email).toBe("ana@example.com");
      expect(res.body.data.user.password).toBeUndefined();

      const savedData = createSpy.mock.calls[0][0];
      expect(savedData.role).toBe(ROLES.USER);
      expect(savedData.password).not.toBe("Password123");
      expect(await bcrypt.compare("Password123", savedData.password)).toBe(true);
    });

    it("devuelve 409 si el correo ya está registrado", async () => {
      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(buildUser());

      const res = await request(app).post("/api/auth/register").send({
        name: "Cliente Prueba",
        email: "cliente@hermanosjota.com.ar",
        password: "Password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("devuelve 400 si los datos de registro son inválidos", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "A",
        email: "correo-invalido",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("inicia sesión con credenciales válidas y devuelve JWT sin exponer password", async () => {
      jest.spyOn(userRepository, "findByEmailWithPassword").mockResolvedValue({
        ...buildUser(),
        password: hashedPassword,
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "CLIENTE@hermanosjota.com.ar",
        password: "Password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("cliente@hermanosjota.com.ar");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("devuelve 401 genérico cuando la contraseña es incorrecta", async () => {
      jest.spyOn(userRepository, "findByEmailWithPassword").mockResolvedValue({
        ...buildUser(),
        password: hashedPassword,
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "cliente@hermanosjota.com.ar",
        password: "WrongPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Credenciales inválidas");
    });

    it("devuelve 401 genérico cuando el email no existe", async () => {
      jest
        .spyOn(userRepository, "findByEmailWithPassword")
        .mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "noexiste@hermanosjota.com.ar",
        password: "Password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Credenciales inválidas");
    });

    it("devuelve 401 si la cuenta está desactivada", async () => {
      jest.spyOn(userRepository, "findByEmailWithPassword").mockResolvedValue({
        ...buildUser({ isActive: false }),
        password: hashedPassword,
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "cliente@hermanosjota.com.ar",
        password: "Password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Verificación de JWT y sesión actual (GET /api/auth/me)", () => {
    it("devuelve 401 si no se envía header Authorization", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("devuelve 401 si el formato del token no es Bearer", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Token cualquiera");

      expect(res.status).toBe(401);
    });

    it("devuelve 401 si el token es inválido", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer token.falso.invalido");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token inválido");
    });

    it("devuelve 401 si el token está expirado", async () => {
      const expiredToken = jwt.sign(
        { id: USER_ID, role: ROLES.USER },
        process.env.JWT_SECRET,
        { expiresIn: -10 }
      );

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("El token ha expirado");
    });

    it("devuelve 401 si el usuario del token está desactivado en BD", async () => {
      jest
        .spyOn(userRepository, "findById")
        .mockResolvedValue(buildUser({ isActive: false }));

      const token = generateToken({ id: USER_ID, role: ROLES.USER });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(401);
    });

    it("devuelve 200 con los datos del usuario autenticado sin password", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValue(buildUser());

      const token = generateToken({ id: USER_ID, role: ROLES.USER });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(USER_ID);
      expect(res.body.data.password).toBeUndefined();
    });
  });
});

describe("Perfil de Usuario (/api/users)", () => {
  it("actualiza solo campos permitidos (name/phone) ignorando intentos de cambiar role", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(buildUser());

    const updateSpy = jest
      .spyOn(userRepository, "updateById")
      .mockResolvedValue(buildUser({ name: "Nombre Actualizado", phone: "1199887766" }));

    const token = generateToken({ id: USER_ID, role: ROLES.USER });

    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Nombre Actualizado",
        phone: "1199887766",
        role: ROLES.ADMIN,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe(ROLES.USER);
    expect(updateSpy).toHaveBeenCalledWith(USER_ID, {
      name: "Nombre Actualizado",
      phone: "1199887766",
    });
  });
});

describe("Autorización y Administración (/api/admin/users y rutas protegidas)", () => {
  it("devuelve 403 cuando un usuario común intenta acceder a /api/admin/users", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(buildUser());

    const userToken = generateToken({ id: USER_ID, role: ROLES.USER });

    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("permite a un administrador listar usuarios sin exponer contraseñas", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(buildAdmin());
    jest
      .spyOn(userRepository, "findAll")
      .mockResolvedValue([buildAdmin(), buildUser()]);

    const adminToken = generateToken({ id: ADMIN_ID, role: ROLES.ADMIN });

    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((u) => u.password === undefined)).toBe(true);
  });

  it("permite a un admin cambiar el rol de otro usuario", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(buildAdmin());
    jest
      .spyOn(userRepository, "updateRole")
      .mockResolvedValue(buildUser({ _id: OTHER_USER_ID, role: ROLES.ADMIN }));

    const adminToken = generateToken({ id: ADMIN_ID, role: ROLES.ADMIN });

    const res = await request(app)
      .patch(`/api/admin/users/${OTHER_USER_ID}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: ROLES.ADMIN });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe(ROLES.ADMIN);
  });

  it("impide que un admin modifique su propio rol o desactive su propia cuenta", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(buildAdmin());

    const adminToken = generateToken({ id: ADMIN_ID, role: ROLES.ADMIN });

    const roleRes = await request(app)
      .patch(`/api/admin/users/${ADMIN_ID}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: ROLES.USER });

    const deactivateRes = await request(app)
      .patch(`/api/admin/users/${ADMIN_ID}/deactivate`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(roleRes.status).toBe(400);
    expect(deactivateRes.status).toBe(400);
  });

  it("permite a un admin desactivar otra cuenta (soft delete)", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(buildAdmin());
    jest
      .spyOn(userRepository, "deactivate")
      .mockResolvedValue(buildUser({ _id: OTHER_USER_ID, isActive: false }));

    const adminToken = generateToken({ id: ADMIN_ID, role: ROLES.ADMIN });

    const res = await request(app)
      .patch(`/api/admin/users/${OTHER_USER_ID}/deactivate`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it("protege las rutas montadas de pedidos y administración de productos", async () => {
    const ordersRes = await request(app).get("/api/orders/my-orders");
    expect(ordersRes.status).toBe(401);

    jest.spyOn(userRepository, "findById").mockResolvedValue(buildUser());
    const userToken = generateToken({ id: USER_ID, role: ROLES.USER });

    const adminProductsRes = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Silla" });

    expect(adminProductsRes.status).toBe(403);
  });
});