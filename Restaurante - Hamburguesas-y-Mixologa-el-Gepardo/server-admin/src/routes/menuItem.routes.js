import express from "express";
import {
    createMenuItem,
    getMenuItems,
    deleteMenuItem
} from "../controllers/menuItem.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Gestión de productos del menú
 */

/**
 * @swagger
 * /menu-items:
 *   post:
 *     summary: Crear item del menú
 *     description: Agrega un nuevo producto al menú de un restaurante
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Hamburguesa"
 *             price: 50
 *             restaurant: "ID_RESTAURANTE"
 *     responses:
 *       201:
 *         description: Item creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createMenuItem);

/**
 * @swagger
 * /menu-items:
 *   get:
 *     summary: Obtener items del menú
 *     description: Lista todos los productos del menú con su restaurante
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Lista de items
 */
router.get("/", getMenuItems);

/**
 * @swagger
 * /menu-items/{id}:
 *   delete:
 *     summary: Eliminar item del menú
 *     description: Elimina un producto del menú por su ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del item
 *     responses:
 *       200:
 *         description: Item eliminado correctamente
 *       404:
 *         description: Item no encontrado
 */
router.delete("/:id", deleteMenuItem);

export default router;