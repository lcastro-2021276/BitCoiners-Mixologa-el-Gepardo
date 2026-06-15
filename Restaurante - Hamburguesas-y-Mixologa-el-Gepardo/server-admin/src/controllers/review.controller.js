import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

export const createReview = async (req, res) => {
    try {
        const { targetType, targetId, rating, comment, customerName, restaurant } = req.body;

        console.log("Datos de reseña recibidos:", { targetType, targetId, rating, comment });

        // Soportar ambos formatos: el nuevo (targetType, targetId) y el antiguo (customerName, restaurant)
        if (targetType && targetId) {
            // Formato nuevo del cliente
            if (!rating || !comment) {
                return res.status(400).json({
                    message: "Calificación y comentario son obligatorios"
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "La calificación debe estar entre 1 y 5"
                });
            }

            const reviewData = {
                targetType,
                targetId,
                rating,
                comment,
            };

            // Agregar user si está disponible del token
            if (req.user?.sub || req.user?.id || req.user?._id) {
                reviewData.user = req.user?.sub || req.user?.id || req.user?._id;
            }

            console.log("Creando reseña con datos:", reviewData);
            const review = await Review.create(reviewData);
            res.status(201).json(review);
        } else {
            // Formato antiguo
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
        }

    } catch (error) {
        console.error("Error al crear reseña:", error);
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

export const getReviewsByTarget = async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const reviews = await Review.find({ targetType, targetId, isDeleted: false });
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