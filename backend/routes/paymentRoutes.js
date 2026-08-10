import express from "express";
import { verifyUser } from "../helper/userAuth.js";
import { processPayment } from "../controller/paymentController.js";

const router = express.Router();

router.route("/payment/process").post(verifyUser, processPayment);

export default router;