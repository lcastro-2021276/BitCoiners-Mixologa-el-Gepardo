import express from "express";
import { getUserNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get("/", getUserNotifications);
router.put("/:notificationId/read", markAsRead);
router.put("/read-all", markAllAsRead);

export default router;
