import userService from "../services/userService.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Rol de usuario actualizado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await userService.deactivateUser(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Usuario desactivado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
};