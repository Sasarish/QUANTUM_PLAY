import Stripe from "stripe";
import HandleError from "../helper/handleError.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { calculateOrderAmounts } from "../helper/priceCalculator.js";

//Configuring stripe
let stripe;
const getStripe = () => {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

//Creating new order
export const createNewOrder = async (req, res, next) => {
    const { shippingAddress, paymentInfo } = req.body;

    if (!paymentInfo?.id) {
        return next(new HandleError("Missing payment information", 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
        return next(new HandleError("Your cart is empty", 400));
    }

    const { itemPrice, taxPrice, shippingPrice, totalPrice } = calculateOrderAmounts(cart.items);

    //Independently verify the payment with Stripe — never trust a client-supplied payment status
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentInfo.id);
    if (
        !paymentIntent ||
        paymentIntent.status !== "succeeded" ||
        paymentIntent.metadata?.userId !== req.user._id.toString() ||
        paymentIntent.amount !== Math.round(totalPrice * 100)
    ) {
        return next(new HandleError("Payment could not be verified", 402));
    }

    //Prevent the same payment from being used to create more than one order
    const alreadyUsed = await Order.exists({ "paymentInfo.id": paymentInfo.id });
    if (alreadyUsed) {
        return next(new HandleError("This payment has already been used for an order", 400));
    }

    const orderItems = cart.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
    }));

    const order = await Order.create({
        shippingAddress,
        orderItems,
        paymentInfo: { id: paymentIntent.id, status: paymentIntent.status },
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    // Empty the user's cart after the order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ success: true, order });
};

//Get single order details
export const getOrderDetails = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return next(new HandleError("Not authorized to view this order", 403));
    }
    res.status(200).json({
        success: true,
        order,
    });
};

//Get all order details of a User
export const getAllOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return next(new HandleError("Orders not found", 404));
    }
    res.status(200).json({
        success: true,
        orders,
    });
};

//Admin get all orders
export const getAllOrdersByAdmin = async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email");
    if (!orders) {
        return next(new HandleError("Orders are not found", 404))
    };

    let totalAmount = 0;
    orders.forEach((order) => (totalAmount += order.totalPrice));

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
};

//Admin delete order
export const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("Order not found", 404));
    };
    if (order.orderStatus !== 'Delivered') {
        return next(new HandleError("This order is under processing and cannot be deleted", 404));
    };
    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
};

//Admin order status update
export const updateOrderStatus = async (req, res, next) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    if (!order) {
        return next(new HandleError("Order not found", 404));
    };
    if (order.orderStatus === 'Delivered') {
        return next(new HandleError("This order has been already delivered", 404));
    };

    //Only deduct stock once — the first time the order leaves "processing"
    if (order.orderStatus === 'processing' && req.body.status !== 'processing') {
        await Promise.all(order.orderItems.map((item) => updateQuantity(item.product, item.quantity)));
    }

    order.orderStatus = req.body.status;
    if (order.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    })
};

//Update quantity function
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error("Product not found");
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}