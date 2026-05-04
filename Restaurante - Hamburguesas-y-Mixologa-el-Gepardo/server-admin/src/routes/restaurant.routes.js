import express from "express";
import {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} from "../controllers/restaurant.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Gestión de restaurantes
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Crear restaurante
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "El Buen Sabor"
 *             address: "Ciudad de Guatemala"
 *             phone: "12345678"
 *             email: "contacto@buensabor.com"
 *             capacity: 50
 *             openingHours: "08:00 - 22:00"
 *     responses:
 *       201:
 *         description: Restaurante creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", verifyToken, createRestaurant);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get("/", getRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Obtener restaurante por ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante no encontrado
 */
router.get("/:id", getRestaurantById);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Actualizar restaurante
 *     tags: [Restaurants]
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
 *             name: "El Buen Sabor Actualizado"
 *             phone: "87654321"
 *     responses:
 *       200:
 *         description: Restaurante actualizado correctamente
 *       404:
 *         description: Restaurante no encontrado
 */
router.put("/:id", verifyToken, updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Eliminar restaurante (soft delete)
 *     tags: [Restaurants]
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
 *         description: Restaurante eliminado correctamente
 *       404:
 *         description: Restaurante no encontrado
 */
router.delete("/:id", verifyToken, deleteRestaurant);

export default router;
