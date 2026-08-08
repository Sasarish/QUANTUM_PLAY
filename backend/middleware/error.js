import HandleError from "../helper/handleError.js"

//common error code 
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //Duplicate key error
    if (err.code === 11000) {
        const message = `This ${Object.keys(err.keyValue)} is already registered`;
        err = new HandleError(message, 400);
    }

    //Invalid Mongo ObjectId (e.g. malformed :id in the URL)
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        err = new HandleError(message, 400);
    }

    //Mongoose schema validation error (missing/invalid required fields)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message).join(", ");
        err = new HandleError(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}