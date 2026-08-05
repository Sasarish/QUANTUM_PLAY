import express from "express";
import { verifyUser } from "../helper/userAuth.js";
import { addToCart, clearCart, getCart, removeCartItem } from "../controller/cartController.js";

const router = express.Router();

router.route("/cart")
    .get(verifyUser, getCart)
    .post(verifyUser, addToCart)
    .delete(verifyUser, clearCart);

router.route("/cart/:id").delete(verifyUser, removeCartItem);

export default router;