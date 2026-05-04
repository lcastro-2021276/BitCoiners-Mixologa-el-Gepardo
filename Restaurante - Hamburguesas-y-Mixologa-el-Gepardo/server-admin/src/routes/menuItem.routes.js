import express from "express";
import {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    getMenuByRestaurant,
    updateMenuItem,
    deleteMenuItem
} from "../controllers/menuItem.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

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
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Hamburguesa Clásica"
 *             description: "Con queso, lechuga y tomate"
 *             price: 75
 *             category: "Platos principales"
 *             restaurant: "ID_DEL_RESTAURANTE"
 *     responses:
 *       201:
 *         description: Item creado correctamente
 *       404:
 *         description: Restaurante no encontrado
 */
router.post("/", verifyToken, createMenuItem);

/**
 * @swagger
 * /menu-items:
 *   get:
 *     summary: Obtener todos los items del menú
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Lista de items
 */
router.get("/", getMenuItems);

/**
 * @swagger
 * /menu-items/{id}:
 *   get:
 *     summary: Obtener item del menú por ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item no encontrado
 */
router.get("/:id", getMenuItemById);

/**
 * @swagger
 * /menu-items/restaurant/{restaurantId}:
 *   get:
 *     summary: Obtener menú por restaurante
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menú del restaurante
 */
router.get("/restaurant/:restaurantId", getMenuByRestaurant);

/**
 * @swagger
 * /menu-items/{id}:
 *   put:
 *     summary: Actualizar item del menú
 *     tags: [Menu]
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
 *             name: "Hamburguesa Especial"
 *             price: 90
 *     responses:
 *       200:
 *         description: Item actualizado correctamente
 *       404:
 *         description: Item no encontrado
 */
router.put("/:id", verifyToken, updateMenuItem);

/**
 * @swagger
 * /menu-items/{id}:
 *   delete:
 *     summary: Eliminar item del menú (soft delete)
 *     tags: [Menu]
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
 *         description: Item eliminado correctamente
 *       404:
 *         description: Item no encontrado
 */
router.delete("/:id", verifyToken, deleteMenuItem);

export default router;
