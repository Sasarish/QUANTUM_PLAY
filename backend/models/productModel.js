import mongoose from "mongoose";

//products model configure and conditions
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    mrp: {
        type: Number,
        required: [true, "Please enter product mrp"],
        max: [9999999, "Price cannot exceed 7 digits"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        max: [9999999, "Price cannot exceed 7 digits"]
    },
    ratings: {
        type: Number,
        default: 0,
    },
    image: [
        {
            public_id: {
                type: String,
                required: [true],
            },
            url: {
                type: String,
                required: [true],
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please enter the product category"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter the product stock"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
            avatar: { type: String },
            name: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Product", productSchema);