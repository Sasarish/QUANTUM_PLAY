import HandleError from "./handleError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//verify login status
export const verifyUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new HandleError("Access denied please login to access", 401));
    }

    let decodedData;
    try {
        decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        return next(new HandleError("Session expired or invalid, please login again", 401));
    }

    const user = await User.findById(decodedData.id);
    if (!user) {
        return next(new HandleError("Access denied please login to access", 401));
    }
    req.user = user;
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