import Order from "../models/Order.js";
import Menu from "../models/MenuItem.js";

export const createOrder = async (req, res) => {
    try {
        const { table, items, orderType, total, status, address, phone, notes, deliveryFee } = req.body;

        let calculatedTotal = 0;

        // Soportar ambos formatos: el nuevo (productId, name, price) y el antiguo (menuItem)
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
            } else {
                throw new Error("Formato de item inválido");
            }

            const subtotal = price * item.quantity;
            calculatedTotal += subtotal;

            return {
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: price,
                name: item.name || menuItem.name
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