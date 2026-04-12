const express = require("express");
const router = express.Router();
const controller = require("../controllers/tableController");

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Gestión de mesas del restaurante
 */

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Crear mesa
 *     description: Registra una nueva mesa con su número, capacidad y estado inicial
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - capacity
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
 *                 default: disponible
 *                 example: "disponible"
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *       400:
 *         description: Datos inválidos o número de mesa duplicado
 */
router.post("/", controller.createTable);

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Obtener mesas
 *     description: Retorna la lista de todas las mesas registradas
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: Lista de mesas
 */
router.get("/", controller.getTables);

module.exports = router;