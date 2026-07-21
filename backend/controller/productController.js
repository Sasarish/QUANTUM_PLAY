import Product from "../models/productModel.js";
import errorHandler from "../helper/handleError.js";
import APIHelper from "../helper/APIHelper.js";
import HandleError from "../helper/handleError.js";

//create Products
export const addProducts = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

//update Products
export const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new errorHandler("Product not found", 404))
  }
  res.status(200).json({
    success: true,
    product,
  });
};

//delete product
export const deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new errorHandler("Product not found", 404))
  }

  res.status(200).json({
    success: true,
    message: "product delete success"
  })
};

//get all products from DB
//http://localhost:8000/api/v1/products?keyword=Invincible
export const getAllProducts = async (req, res, next) => {

  const resultsPerPage = 12;
  const apiHelper = new APIHelper(Product.find(), req.query).search().filter();
  const filteredQuery = apiHelper.query.clone();
  const productCount = await filteredQuery.countDocuments();

  const totalPages = Math.ceil(productCount / resultsPerPage);
  const page = Number(req.query.page) || 1;

  if (totalPages > 0 && page > totalPages) {
    return next(new errorHandler("This page doesn't exist", 404));
  }

  apiHelper.pagination(resultsPerPage);

  const products = await apiHelper.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultsPerPage,
    totalPages,
    currentPage: page,
  })
};

//get single product by id
export const getSingleProduct = async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }
  return res.status(200).json({ success: true, product });
};

//Product reviews
export const createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar.url,
    rating: Number(rating),
    comment,
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }

  const reviewExists = product.reviews.find((review) => review.user.toString() == req.user.id);
  if (reviewExists) {
    //update existing review
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user.id) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    //add push reviews
    product.reviews.push(review);
  }
  //Update Review count
  product.numOfReviews = product.reviews.length;

  //Update rating
  let sum = 0;
  product.reviews.forEach((review) => {
    sum = sum + review.rating;
  });
  product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;


  //Save details
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  })
};

//View Product reviews
export const viewProductReviews = async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }
  res.status(200).json({
    success: true,
    review: product.reviews,
  });
};

//Admin view all Products
export const getAllProductsByAdmin = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
};

//Delete Reviews
export const adminDeleteReview = async (req, res, next) => {
  //In Query ProductId = product Id
  //In query Id = review Id
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }
  const reviews = product.reviews.filter((review) => review._id.toString() !== req.query.id.toString());

  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  const ratings = reviews.length > 0 ? sum / reviews.length : 0;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully"
  })
};
