import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del rol (se almacena en mayúsculas)
 *           example: "ADMIN"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del rol
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del rol
 */
const roleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "El nombre del rol es obligatorio"],
        unique: true,
        trim: true,
        uppercase: true
    }
}, { 
    timestamps: true 
});

export default mongoose.models.Role || mongoose.model("Role", roleSchema);