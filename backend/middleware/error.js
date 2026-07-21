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

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}