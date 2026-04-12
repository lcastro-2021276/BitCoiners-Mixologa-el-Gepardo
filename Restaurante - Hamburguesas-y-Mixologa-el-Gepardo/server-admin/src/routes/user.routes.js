import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear usuario
 *     description: Registra un nuevo usuario en el sistema con nombre, correo, contraseña y rol asignado
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Angelo García"
 *               email:
 *                 type: string
 *                 example: "agarcia@gmail.com"
 *               password:
 *                 type: string
 *                 example: "puvlolover123"
 *               role:
 *                 type: string
 *                 example: "661f8c1e2f1b2a0012345678"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos, rol inexistente o usuario ya registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener usuarios
 *     description: Retorna la lista de todos los usuarios registrados en el sistema
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getUsers);

export default router;