const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       required:
 *         - number
 *         - capacity
 *       properties:
 *         number:
 *           type: number
 *           description: Número identificador único de la mesa
 *           example: 5
 *         capacity:
 *           type: number
 *           description: Capacidad máxima de personas en la mesa
 *           example: 4
 *         status:
 *           type: string
 *           enum: [disponible, ocupada]
 *           default: disponible
 *           description: Estado actual de la mesa
 *           example: "disponible"
 */
const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["disponible", "ocupada"],
        default: "disponible"
    }
});

module.exports = mongoose.model("Table", tableSchema);