import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: false,
        },
        items: [
            {
                menuItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    required: false,
                },
                name: {
                    type: String,
                    required: false,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        total: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pendiente", "preparacion", "entregado"],
            default: "pendiente",
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);

export default mongoose.model("Order", orderSchema);