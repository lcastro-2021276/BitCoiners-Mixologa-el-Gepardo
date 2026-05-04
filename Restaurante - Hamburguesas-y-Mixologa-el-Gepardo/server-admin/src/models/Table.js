import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["disponible", "ocupada"],
        default: "disponible"
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Table", tableSchema);