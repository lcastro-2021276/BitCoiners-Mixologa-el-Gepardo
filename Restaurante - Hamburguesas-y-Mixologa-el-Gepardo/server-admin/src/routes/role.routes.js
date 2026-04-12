import { Router } from "express";
import { createRole, getRoles } from "../controllers/role.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles del sistema
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crear rol
 *     description: Registra un nuevo rol en el sistema. El nombre se almacena en mayúsculas automáticamente
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "ADMIN"
 *     responses:
 *       201:
 *         description: Rol creado correctamente
 *       400:
 *         description: Nombre inválido o rol ya existente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", createRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener roles
 *     description: Retorna la lista de todos los roles registrados, ordenados por fecha de creación
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getRoles);

export default router;