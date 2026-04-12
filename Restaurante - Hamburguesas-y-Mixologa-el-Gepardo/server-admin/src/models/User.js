import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           description: Nombre completo del usuario
 *           example: "Pablo Angel"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico único del usuario
 *           example: "agarcia-2024043@gmail.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del usuario (se almacena hasheada con bcrypt)
 *           example: "puvlolover123"
 *         role:
 *           type: string
 *           description: ID del rol asignado al usuario
 *           $ref: '#/components/schemas/Role'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del usuario
 */
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        minlength: 3 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    role: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);