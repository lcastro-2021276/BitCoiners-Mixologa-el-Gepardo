import Restaurant from "../models/Restaurant.js";

export const createRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isDeleted: false });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ _id: req.params.id, isDeleted: false });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurante no encontrado" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurante no encontrado" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurante no encontrado" });
        }
        res.json({ message: "Restaurante eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

