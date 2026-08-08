import express from "express";
import { addProducts, adminDeleteReview, checkCanReview, createProductReview, deleteProduct, getAllProducts, getAllProductsByAdmin, getProductCategories, getSingleProduct, updateProduct, viewProductReviews } from "../controller/productController.js"
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js";

const router = express.Router();

//User side
router.get("/products", getAllProducts);
router.get("/categories", getProductCategories);
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(verifyUser, createProductReview);
router.get("/can-review/:productId", verifyUser, checkCanReview);

//Admin side
router.route("/admin/product/create").post(verifyUser, roleBasedAccess("admin"), addProducts);
router.route("/admin/product/:id").put(verifyUser, roleBasedAccess("admin"), updateProduct).delete(verifyUser, roleBasedAccess("admin"), deleteProduct);
router.route("/admin/reviews").get(verifyUser, roleBasedAccess("admin"), viewProductReviews).delete(verifyUser, roleBasedAccess("admin"), adminDeleteReview);
router.route("/admin/products").get(verifyUser, roleBasedAccess("admin"), getAllProductsByAdmin);

export default router;