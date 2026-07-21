import HandleError from "./handleError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//verify login status
export const verifyUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new HandleError("Access denied please login to access", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    next();
};

//verify user roles
export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HandleError(`Role - ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}
