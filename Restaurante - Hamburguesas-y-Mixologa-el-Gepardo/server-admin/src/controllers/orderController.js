import Order from "../models/Order.js";
import Menu from "../models/MenuItem.js";
import { createNotification } from "./notification.controller.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
    try {
        const { table, items, orderType, total, status, address, phone, notes, deliveryFee } = req.body;

        let calculatedTotal = 0;

        // Soportar ambos formatos: el nuevo (productId, name, price), el antiguo (menuItem) y el directo (name, price)
        const detailedItems = await Promise.all(items.map(async (item) => {
            let menuItem;
            let price;

            if (item.productId) {
                // Formato nuevo del cliente
                menuItem = await Menu.findById(item.productId);
                if (!menuItem) {
                    throw new Error("Producto no encontrado");
                }
                price = item.price || menuItem.price;
            } else if (item.menuItem) {
                // Formato antiguo
                menuItem = await Menu.findById(item.menuItem);
                if (!menuItem) {
                    throw new Error("Producto no encontrado");
                }
                price = menuItem.price;
            } else if (item.name && item.price) {
                // Formato directo con name y price (sin buscar en DB)
                price = item.price;
                menuItem = null;
            } else {
                throw new Error("Formato de item inválido");
            }

            const subtotal = price * item.quantity;
            calculatedTotal += subtotal;

            return {
                menuItem: menuItem ? menuItem._id : null,
                name: item.name || (menuItem ? menuItem.name : 'Producto'),
                quantity: item.quantity,
                price: price,
            };
        }));

        // Usar el total proporcionado o el calculado
        const finalTotal = total || calculatedTotal;
        if (deliveryFee) {
            finalTotal += deliveryFee;
        }

        const orderData = {
            items: detailedItems,
            total: finalTotal,
            status: status || 'pendiente'
        };

        if (table) {
            orderData.table = table;
        }

        if (orderType) {
            orderData.orderType = orderType;
        }

        if (address) {
            orderData.address = address;
        }

        if (phone) {
            orderData.phone = phone;
        }

        if (notes) {
            orderData.notes = notes;
        }

        if (deliveryFee) {
            orderData.deliveryFee = deliveryFee;
        }

        const order = new Order(orderData);
        await order.save();

        // Enviar notificación al cliente cuando se crea el pedido
        if (req.user && req.user.id) {
            await createNotification(
                req.user.id,
                "order_created",
                "Pedido en proceso",
                `Tu pedido #${order._id.toString().slice(-6)} ha sido recibido y está siendo preparado.`,
                order._id
            );
        }

        res.status(201).json(order);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(400).json({ error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { status },
            { new: true }
        );

        // Enviar notificación cuando el pedido es entregado
        if (status === "entregado" && req.user && req.user.id) {
            await createNotification(
                req.user.id,
                "order_delivered",
                "Pedido entregado",
                `Tu pedido #${order._id.toString().slice(-6)} ha sido entregado. ¡Buen provecho!`,
                order._id
            );
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getOrders = async (req, res) => {
    const orders = await Order.find({ isDeleted: false }).populate("table items.menuItem");
    res.json(orders);
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};