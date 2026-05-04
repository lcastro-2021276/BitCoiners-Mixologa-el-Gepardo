import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = new User({
      name,
      email,
      password,  // el modelo User tiene pre('save') que hashea automáticamente
      role
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "restaurante_secreto",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};