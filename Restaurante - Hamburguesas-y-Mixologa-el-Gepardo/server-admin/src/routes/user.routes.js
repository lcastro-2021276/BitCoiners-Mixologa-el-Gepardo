import { Router } from "express";
import {
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

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
 *     security:
 *       - bearerAuth: []
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
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "661f8c1e2f1b2a0012345678"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario creado correctamente"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Datos inválidos, rol inexistente o usuario ya registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", register);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna la lista de todos los usuarios registrados en el sistema
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Retorna un usuario específico según su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "661f8c1e2f1b2a0012345678"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: ID no válido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente. La contraseña es opcional.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *         example: "661f8c1e2f1b2a0012345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Angelo García"
 *               email:
 *                 type: string
 *                 example: "agarcia@gmail.com"
 *               password:
 *                 type: string
 *                 example: "nuevaPassword123"
 *               role:
 *                 type: string
 *                 example: "661f8c1e2f1b2a0012345678"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado correctamente"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *       400:
 *         description: Datos inválidos o ID no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina permanentemente un usuario del sistema según su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *         example: "661f8c1e2f1b2a0012345678"
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado correctamente"
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", deleteUser);

export default router;