import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "Consulta general",
    },
    message: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["pending", "read", "answered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
