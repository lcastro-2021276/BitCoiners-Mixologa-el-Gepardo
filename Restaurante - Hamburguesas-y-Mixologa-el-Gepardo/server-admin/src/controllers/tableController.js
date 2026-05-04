import Table from "../models/Table.js";
import Restaurant from "../models/Restaurant.js";

export const createTable = async (req, res) => {
    try {
        const { restaurant } = req.body;
        const existingRestaurant = await Restaurant.findOne({ _id: restaurant, isDeleted: false });
        if (!existingRestaurant) {
            return res.status(404).json({ message: "El restaurante no existe" });
        }
        const table = await Table.create(req.body);
        res.status(201).json(table);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTables = async (req, res) => {
    try {
        const tables = await Table.find().populate({
            path: "restaurant",
            match: { isDeleted: false }
        });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTableById = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id).populate("restaurant");
        if (!table) {
            return res.status(404).json({ message: "Mesa no encontrada" });
        }
        res.json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!table) {
            return res.status(404).json({ message: "Mesa no encontrada" });
        }
        res.json(table);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id);
        if (!table) {
            return res.status(404).json({ message: "Mesa no encontrada" });
        }
        res.json({ message: "Mesa eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};