import express from "express";
import {
    createTable,
    getTables,
    getTableById,
    updateTable,
    deleteTable
} from "../controllers/tableController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Gestión de mesas
 */

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Crear mesa
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - capacity
 *               - restaurant
 *             properties:
 *               number:
 *                 type: number
 *                 example: 5
 *               capacity:
 *                 type: number
 *                 example: 4
 *               status:
 *                 type: string
 *                 enum: [disponible, ocupada]
 *                 example: "disponible"
 *               restaurant:
 *                 type: string
 *                 example: "ID_DEL_RESTAURANTE"
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Restaurante no encontrado
 */
router.post("/", verifyToken, createTable);

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Obtener todas las mesas
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: Lista de mesas
 */
router.get("/", getTables);

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Obtener mesa por ID
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mesa encontrada
 *       404:
 *         description: Mesa no encontrada
 */
router.get("/:id", getTableById);

/**
 * @swagger
 * /tables/{id}:
 *   put:
 *     summary: Actualizar mesa
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "ocupada"
 *             capacity: 6
 *     responses:
 *       200:
 *         description: Mesa actualizada correctamente
 *       404:
 *         description: Mesa no encontrada
 */
router.put("/:id", verifyToken, updateTable);

/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     summary: Eliminar mesa
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mesa eliminada correctamente
 *       404:
 *         description: Mesa no encontrada
 */
router.delete("/:id", verifyToken, deleteTable);

export default router;
