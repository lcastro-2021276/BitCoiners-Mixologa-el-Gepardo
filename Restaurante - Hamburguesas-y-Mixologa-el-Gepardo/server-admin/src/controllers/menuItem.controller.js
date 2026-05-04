import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

export const createMenuItem = async (req, res) => {
    try {
        const { restaurant } = req.body;
        const existingRestaurant = await Restaurant.findOne({ _id: restaurant, isDeleted: false });
        if (!existingRestaurant) {
            return res.status(404).json({ message: "El restaurante no existe" });
        }
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isDeleted: false }).populate({
            path: "restaurant",
            match: { isDeleted: false }
        });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findOne({ _id: req.params.id, isDeleted: false })
            .populate("restaurant");
        if (!menuItem) {
            return res.status(404).json({ message: "Item del menú no encontrado" });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMenuByRestaurant = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({
            restaurant: req.params.restaurantId,
            isDeleted: false
        });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuItem) {
            return res.status(404).json({ message: "Item del menú no encontrado" });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!menuItem) {
            return res.status(404).json({ message: "Item del menú no encontrado" });
        }
        res.json({ message: "Item del menú eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

