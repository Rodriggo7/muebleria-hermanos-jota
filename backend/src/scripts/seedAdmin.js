import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";
import userRepository from "../repositories/userRepository.js";

const SALT_ROUNDS = 10;

const seedAdmin = async () => {
  const mongoUri = process.env.MONGO_URI;
  const adminName = process.env.ADMIN_NAME?.trim() || "Administrador";
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!mongoUri) {
    console.error("Error: MONGO_URI no está configurado en las variables de entorno.");
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error(
      "Error: ADMIN_EMAIL y ADMIN_PASSWORD deben estar configurados en .env para crear el administrador inicial."
    );
    process.exit(1);
  }

  if (adminPassword.length < 6 || adminPassword.length > 72) {
    console.error(
      "Error: ADMIN_PASSWORD debe tener entre 6 y 72 caracteres."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    const existingUser = await userRepository.findByEmail(adminEmail);

    if (existingUser) {
      console.log(
        `El usuario administrador (${adminEmail}) ya existe. No se realizaron cambios.`
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    await userRepository.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: ROLES.ADMIN,
      isActive: true,
    });

    console.log(`Usuario administrador creado correctamente: ${adminEmail}`);
  } catch (error) {
    console.error("Error al ejecutar el seed de administrador:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();