import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

export const createReview = async (req, res) => {
    try {
        const { customerName, rating, comment, restaurant } = req.body;

        if (!customerName || !rating || !restaurant) {
            return res.status(400).json({
                message: "Nombre, calificación y restaurante son obligatorios"
            });
        }

        const existingRestaurant = await Restaurant.findById(restaurant);
        if (!existingRestaurant) {
            return res.status(404).json({ message: "El restaurante no existe" });
        }

        const review = await Review.create(req.body);
        res.status(201).json(review);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isDeleted: false })
            .populate({
                path: "restaurant",
                match: { isDeleted: false }
            });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: "Reseña eliminada (soft delete)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};