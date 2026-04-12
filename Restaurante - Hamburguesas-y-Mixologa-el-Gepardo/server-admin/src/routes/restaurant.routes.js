import express from "express";
import {
    createRestaurant,
    getRestaurants,
    deleteRestaurant
} from "../controllers/restaurant.controller.js";

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
 *     description: Registra un nuevo restaurante en el sistema
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "El Buen Sabor"
 *             address: "Ciudad de Guatemala"
 *             phone: "12345678"
 *     responses:
 *       201:
 *         description: Restaurante creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createRestaurant);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Obtener restaurantes
 *     description: Lista todos los restaurantes registrados
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get("/", getRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Eliminar restaurante
 *     description: Elimina un restaurante por su ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del restaurante
 *     responses:
 *       200:
 *         description: Restaurante eliminado correctamente
 *       404:
 *         description: Restaurante no encontrado
 */
router.delete("/:id", deleteRestaurant);

export default router;