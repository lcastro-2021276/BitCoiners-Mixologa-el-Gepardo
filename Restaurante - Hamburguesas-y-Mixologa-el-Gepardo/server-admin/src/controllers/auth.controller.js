import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const register = async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name || body.fullName || body.firstName || '';
    const surname = body.surname || body.lastName || '';
    const username = body.username || body.user || '';
    const email = body.email || '';
    const password = body.password || '';
    const phone = body.phone || '';

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Obtener el rol de "Cliente" por defecto
    let roleId;
    const clientRole = await Role.findOne({ name: "Cliente" });
    if (clientRole) {
      roleId = clientRole._id;
    } else {
      // Si no existe el rol, crear uno por defecto
      const newRole = new Role({ name: "Cliente" });
      await newRole.save();
      roleId = newRole._id;
    }

    const newUser = new User({
      name,
      surname: surname || '',
      username,
      email,
      password,  // el modelo User tiene pre('save') que hashea automáticamente
      phone: phone || '',
      role: roleId
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: error.message || "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "restaurante_secreto",
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || "restaurante_refresh_secreto",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      accessToken,
      refreshToken,
      userDetails: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: "No existe una cuenta con este correo electrónico" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Aquí se enviaría el correo real
    // Por ahora, simulamos el envío devolviendo el token
    res.json({
      message: "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined // Solo devolver token en desarrollo
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
      isDeleted: false
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: "Contraseña restablecida exitosamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};