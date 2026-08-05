import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
                name: String,
                price: Number,
                image: String,
                stock: Number,
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);