import mongoose from "mongoose";
import { ROLES, VALID_ROLES } from "../constants/roles.js";

const sanitizeUser = (_doc, ret) => {
  delete ret.password;
  return ret;
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede superar los 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "El formato del correo electrónico no es válido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: VALID_ROLES,
        message: "El rol especificado no es válido",
      },
      default: ROLES.USER,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, "El teléfono no puede superar los 30 caracteres"],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { transform: sanitizeUser },
    toObject: { transform: sanitizeUser },
  }
);

const User = mongoose.model("User", userSchema);

export default User;