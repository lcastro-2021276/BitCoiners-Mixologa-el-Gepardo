import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const register = async (req, res) => {
  try {
    const body = req.body || {};

    const name = body.name || body.fullName || body.firstName || "";
    const surname = body.surname || body.lastName || "";
    const username = body.username || body.user || "";
    const email = body.email || "";
    const password = body.password || "";
    const phone = body.phone || "";
    const role = body.role;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Faltan campos requeridos: nombre, email y contraseña",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "El usuario ya existe",
      });
    }

    const finalUsername = username || email.split("@")[0];

    const existingUsername = await User.findOne({
      username: finalUsername,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "El nombre de usuario ya existe",
      });
    }

    let roleId;

    if (role) {
      let roleDoc;

      try {
        roleDoc = await Role.findById(role);
      } catch {}

      if (!roleDoc) {
        roleDoc = await Role.findOne({
          name: role,
        });
      }

      if (roleDoc) {
        roleId = roleDoc._id;
      }
    } else {
      const clientRole = await Role.findOne({
        name: "Cliente",
      });

      if (clientRole) {
        roleId = clientRole._id;
      }
    }

    const newUser = new User({
      name,
      surname,
      username: finalUsername,
      email,
      password,
      phone,

      // IMPORTANTE
      role_id: roleId,
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.error("Error en registro:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { emailOrUsername, email, password } = req.body;

    const loginValue = (emailOrUsername || email || "").trim();

    const user = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    }).populate("role_id");

    console.log("USUARIO ENCONTRADO:", user);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "restaurante_secreto",
      {
        expiresIn: "2h",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET || "restaurante_refresh_secreto",
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login exitoso",
      accessToken,
      refreshToken,
      userDetails: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "No existe una cuenta con este correo electrónico",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpiry = new Date(Date.now() + 3600000);

    await user.save();

    res.json({
      message:
        "Se ha enviado un correo con instrucciones para restablecer tu contraseña",

      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,

      resetPasswordExpiry: {
        $gt: Date.now(),
      },

      isDeleted: false,
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    user.password = newPassword;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpiry = undefined;

    await user.save();

    res.json({
      message: "Contraseña restablecida exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
