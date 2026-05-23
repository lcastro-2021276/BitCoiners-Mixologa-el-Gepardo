import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);