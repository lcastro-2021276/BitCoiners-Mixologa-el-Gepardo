import Notification from "../models/Notification.js";

// Obtener notificaciones de un usuario
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

// Marcar notificación como leída
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findByIdAndUpdate(
      notificationId,
      { read: true }
    );

    res.json({ message: "Notificación marcada como leída" });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar notificación" });
  }
};

// Marcar todas como leídas
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: "Todas las notificaciones marcadas como leídas" });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar notificaciones" });
  }
};

// Crear notificación (usado internamente)
export const createNotification = async (userId, type, title, message, orderId = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      orderId,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};
