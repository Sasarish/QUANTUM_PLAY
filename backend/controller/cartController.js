import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import HandleError from "../helper/handleError.js";

// Get logged-in user's cart
export const getCart = async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cartItems: cart.items });
};

// Add or update an item in the cart
export const addToCart = async (req, res, next) => {
    const { id, quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) return next(new HandleError("Product not found", 404));
    if (quantity > product.stock) {
        return next(new HandleError("Requested quantity exceeds available stock", 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => item.product.toString() === id);
    if (existingItem) {
        existingItem.quantity = quantity;
    } else {
        cart.items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image[0]?.url,
            stock: product.stock,
            quantity,
        });
    }

    await cart.save();
    res.status(200).json({ success: true, cartItems: cart.items });
};

// Remove a single item from the cart
export const removeCartItem = async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new HandleError("Cart not found", 404));

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.id);
    await cart.save();
    res.status(200).json({ success: true, cartItems: cart.items });
};

// Clear the entire cart (after order placed / manual clear)
export const clearCart = async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    res.status(200).json({ success: true, cartItems: [] });
};