import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import roleRoutes from "./src/routes/role.routes.js";
import restaurantRoutes from "./src/routes/restaurant.routes.js";
import tableRoutes from "./src/routes/table.routes.js";
import menuItemRoutes from "./src/routes/menuItem.routes.js";
import orderRoutes from "./src/routes/order.routes.js"; 
import userRoutes from "./src/routes/user.routes.js";
import reservationRoutes from "./src/routes/reservation.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Restaurante",
            version: "1.0.0",
            description: "Documentación completa del Sistema Gestor Restaurantes"
        },
        servers: [
            { url: process.env.API_URL || "http://localhost:3000", description: "API en producción" },
            { url: "http://localhost:3000", description: "API local" }
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
        "./src/routes/auth.routes.js",
        "./src/routes/role.routes.js",
        "./src/routes/menuItem.routes.js",
        "./src/routes/restaurant.routes.js",
        "./src/routes/table.routes.js",
        "./src/routes/order.routes.js",
        "./src/routes/user.routes.js",
        "./src/routes/reservation.routes.js"
    ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err));

app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/tables", tableRoutes);
app.use("/menu-items", menuItemRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);
app.use("/reviews", reviewRoutes);
app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:" + PORT);
    console.log("Swagger docs: http://localhost:" + PORT + "/api-docs");
});
