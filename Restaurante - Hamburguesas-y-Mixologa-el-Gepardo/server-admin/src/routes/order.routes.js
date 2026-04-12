const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de pedidos
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear pedido
 *     description: Crea un nuevo pedido asociado a una mesa con sus productos
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             table: "ID_MESA"
 *             items:
 *               - menuItem: "ID_PRODUCTO"
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", controller.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener pedidos
 *     description: Retorna todos los pedidos con sus detalles
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", controller.getOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Actualizar estado del pedido
 *     description: Cambia el estado de un pedido (pendiente, en proceso, completado)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "completado"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Pedido no encontrado
 */
router.put("/:id/status", controller.updateStatus);

module.exports = router;