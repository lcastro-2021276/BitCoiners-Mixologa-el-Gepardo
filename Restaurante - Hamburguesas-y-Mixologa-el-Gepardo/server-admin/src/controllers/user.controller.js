import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js";

/* =========================
        REGISTER / CREATE
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Nombre, correo, contraseña y rol son obligatorios" });
    }

    if (name.length < 3) {
      return res.status(400).json({ message: "El nombre debe tener al menos 3 caracteres" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El formato del correo electrónico no es válido" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ message: "El ID del rol no es válido" });
    }

    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ message: "El rol no existe" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: roleExists.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

/* =========================
        GET ALL
========================= */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .populate("role", "name")
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

/* =========================
        GET PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    // Obtener el ID del usuario del token JWT
    // El servicio de autenticación (.NET) usa el claim 'sub' para el ID del usuario
    const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado - Token inválido" });
    }

    const user = await User.findOne({ _id: userId, isDeleted: false })
      .populate("role", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
};

/* =========================
        UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    // El servicio de autenticación (.NET) usa el claim 'sub' para el ID del usuario
    const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado - Token inválido" });
    }

    const { displayName, phone, email, username } = req.body;

    const update = {};
    if (displayName) update.name = displayName;
    if (phone) update.phone = phone;
    if (email) update.email = email;
    if (username) update.username = username;

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      update,
      { new: true }
    )
      .populate("role", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

/* =========================
        CHANGE PASSWORD
========================= */
export const changePassword = async (req, res) => {
  try {
    // El servicio de autenticación (.NET) usa el claim 'sub' para el ID del usuario
    const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado - Token inválido" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Contraseña actual y nueva son obligatorias" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar contraseña", error: error.message });
  }
};

/* =========================
        DELETE ACCOUNT
========================= */
export const deleteAccount = async (req, res) => {
  try {
    // El servicio de autenticación (.NET) usa el claim 'sub' para el ID del usuario
    const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado - Token inválido" });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar cuenta", error: error.message });
  }
};

/* =========================
        GET BY ID
========================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .populate("role", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

/* =========================
        UPDATE
========================= */
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    if (name && name.length < 3) {
      return res.status(400).json({ message: "El nombre debe tener al menos 3 caracteres" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "El formato del correo electrónico no es válido" });
      }

      const emailTaken = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailTaken) {
        return res.status(400).json({ message: "El correo ya está en uso por otro usuario" });
      }
    }

    if (password && password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    if (role) {
      if (!mongoose.Types.ObjectId.isValid(role)) {
        return res.status(400).json({ message: "El ID del rol no es válido" });
      }

      const roleExists = await Role.findById(role);
      if (!roleExists) {
        return res.status(400).json({ message: "El rol no existe" });
      }
    }

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role;
    if (password) update.password = password;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      update,
      { new: true }
    )
      .populate("role", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

/* =========================
        DELETE
========================= */
export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};