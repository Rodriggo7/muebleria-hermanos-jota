import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error("JWT_SECRET no está configurado en el servidor");
    error.statusCode = 500;
    throw error;
  }

  return secret;
};

export const generateToken = ({ id, role }) => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(
    {
      id: id.toString(),
      role,
    },
    secret,
    { expiresIn }
  );
};

export default generateToken;