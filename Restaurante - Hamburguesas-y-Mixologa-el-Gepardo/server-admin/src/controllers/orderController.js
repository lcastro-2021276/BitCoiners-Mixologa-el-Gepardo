import Order from "../models/Order.js";
import Menu from "../models/MenuItem.js";

export const createOrder = async (req, res) => {
    try {
        const { table, items } = req.body;

        let total = 0;

        const detailedItems = await Promise.all(items.map(async (item) => {
            const menuItem = await Menu.findById(item.menuItem);

            if (!menuItem) {
                throw new Error("Producto no encontrado");
            }

            const subtotal = menuItem.price * item.quantity;
            total += subtotal;

            return {
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price
            };
        }));

        const order = new Order({
            table,
            items: detailedItems,
            total
        });

        await order.save();

        res.status(201).json(order);

    } catch (error) {
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