import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    // Nuevo formato para el cliente
    targetType: { type: String },
    targetId: { type: String },
    user: { type: String },
    // Formato antiguo para el admin
    customerName: { type: String },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    // Campos comunes
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);