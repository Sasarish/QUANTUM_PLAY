import Stripe from "stripe";
import HandleError from "../helper/handleError.js";
import Cart from "../models/cartModel.js";
import { calculateOrderAmounts } from "../helper/priceCalculator.js";

let stripe;
const getStripe = () => {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

//Create a Stripe PaymentIntent for the user's current cart total (computed server-side, not client-supplied)
export const processPayment = async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
        return next(new HandleError("Your cart is empty", 400));
    }

    const { totalPrice } = calculateOrderAmounts(cart.items);

    const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe expects the smallest currency unit
        currency: process.env.STRIPE_CURRENCY || "lkr",
        metadata: { userId: req.user._id.toString() },
    });

    res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
};