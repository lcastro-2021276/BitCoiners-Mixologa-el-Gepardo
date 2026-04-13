import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
app.use(express.json());

/**
 * @swagger
 * tags:
 *   - name: Users
 *   - name: Auth
 *   - name: Roles
 *   - name: Restaurants
 *   - name: Reservations
 *   - name: Menu
 *   - name: Tables
 *   - name: Orders
 */

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Restaurante",
            version: "1.0.0",
            description: "Documentación completa del Sistema Gestor Restaurantes"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [
    "./server.js",
    "./src/routes/auth.routes.js",
    "./src/routes/menuItem.routes.js",
    "./src/routes/order.routes.js",
    "./src/routes/restaurant.routes.js",
    "./src/routes/role.routes.js",
    "./src/routes/table.routes.js",
    "./src/routes/user.routes.js"
]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err));

const Role = mongoose.model("Role", new mongoose.Schema({
    name: { type: String, required: true, unique: true, uppercase: true },
    permissions: [String]
}, { timestamps: true }));

const User = mongoose.model("User", new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }
}, { timestamps: true }));

const Restaurant = mongoose.model("Restaurant", new mongoose.Schema({
    name: { type: String, required: true },
    address: String
}, { timestamps: true }));

const Reservation = mongoose.model("Reservation", new mongoose.Schema({
    customerName: String,
    reservationDate: Date,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
}, { timestamps: true }));

const MenuItem = mongoose.model("MenuItem", new mongoose.Schema({
    name: String,
    price: Number,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
}));

const Table = mongoose.model("Table", new mongoose.Schema({
    number: { type: Number, unique: true },
    capacity: Number,
    status: { type: String, default: "disponible" }
}));

const Order = mongoose.model("Order", new mongoose.Schema({
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    status: { type: String, default: "pendiente" }
}, { timestamps: true }));

const auth = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Token inválido" });
    }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 */
app.post("/users", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "El usuario ya existe con ese email"
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role
        });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login usuario
 *     tags: [Auth]
 */
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secreto",
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login exitoso",
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});