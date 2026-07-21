import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

//User model condition and configuration
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxLength: [25, "Invalid name. Please enter a name with fewer than 25 charecters"],
            minLength: [3, "Name should contain more than 3 charecters"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: [validator.isEmail, "Please enter valid email"],
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: [8, "Password should be greater than 8 charecters"],
            select: false,
        },
        avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true,
            }
        },
        role: {
            type: String,
            default: "user",
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

//password bcrypt
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcryptjs.hash(this.password, 10);
});

//assign jwt token after login
userSchema.methods.getjwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//verify password
userSchema.methods.verifyPassword = async function (userPassword) {
    return await bcryptjs.compare(userPassword, this.password);
};

//generate Password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
}

export default mongoose.model("User", userSchema);