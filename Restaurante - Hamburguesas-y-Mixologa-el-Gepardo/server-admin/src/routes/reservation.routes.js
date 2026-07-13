import { Router } from "express";
import {
  getReservations,
  createReservation,
  deleteReservation,
} from "../controllers/reservation.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestión de reservaciones
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Obtener todas las reservaciones
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 */
router.get("/", getReservations);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crear reservación
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             restaurant: "ID_DEL_RESTAURANTE"
 *             customerName: "Juan Perez"
 *             customerPhone: "+1234567890"
 *             customerEmail: "juan@test.com"
 *             reservationDate: "2026-07-13T19:00:00Z"
 *             numberOfGuests: 4
 *     responses:
 *       201:
 *         description: Reservación creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createReservation);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Eliminar reservación (soft delete)
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservación eliminada correctamente
 *       404:
 *         description: Reservación no encontrada
 */
router.delete("/:id", deleteReservation);

export default router;