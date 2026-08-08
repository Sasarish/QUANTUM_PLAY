import HandleError from "../helper/handleError.js";
import { sendToken } from "../helper/jwtToken.js";
import { sendEmail } from "../helper/sendEmail.js";
import User from "../models/userModel.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";


//User register
export const registerUser = async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    if (!name) {
        return next(new HandleError("Name cannot be empty", 400))
    }
    if (!email) {
        return next(new HandleError("Email cannot be empty", 400))
    }
    if (!password) {
        return next(new HandleError("Password cannot be empty", 400))
    }

    //Uploading photos to cloudinary (my folder name : "avatars")
    const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    })

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });
    sendToken(user, 201, res);
};

//User login
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HandleError("Email or Password cannot be empty", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid Email ID or Password", 401))
    }
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
        return next(new HandleError("Invalid Email ID or Password", 401))
    }
    sendToken(user, 200, res)
}

//reset Password request
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User does not exists", 400));
    }

    let resetToken;
    try {
        resetToken = user.createPasswordResetToken();
        await user.save();
        console.log(resetToken);
    } catch (error) {
        console.log(error);
        return next(new HandleError("Could not save reset token, Try again later..", 500));
    }

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;
    const message = `Reset your Password using the link below:\n${resetPasswordURL}\n\nThe Link expires in 30 minutes.\n\nIf this wasn't you, Please ignore this message`;

    const messageHTML = `
    <div style="font-family: Arial, Helvetica, sans-serif; padding: 20px; background:#f4f4f4 ;">
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
        <h2 style="color:#333;">Password Reset Request </h2>
        <p>Hello,</p>
        <p>You requested to reset your Password. click the button to continue</p>

        <a href="${resetPasswordURL}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white;
            text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Reset Password
        </a>

        <p style="margin-top: 20px;">
            Or copy and paste this link in you browser:<br>
            <a href="${resetPasswordURL}">${resetPasswordURL}</a>
        </p>

        <p style="color: red; font-weight: bold;">
            This link will expire in 30 minutes.
        </p>

        <p>If you didn't request a password reset, please ignore this email.</p>

        <br>
        <p>Regards, <br>Your website team</p>
    </div>
</div>
    `

    try {
        await sendEmail({ email: user.email, subject: "Password reset Request", message, htmlMessage: messageHTML });
        res.status(200).json({
            success: true,
            message: `Email is sent to ${user.email} successfully`,
        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError("Email could not be send. Try again later !", 500));
    }
};

//Password reseting
export const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new HandleError("Invalid or Reset code expired", 400))
    }
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next(new HandleError("Password doesn't match.", 400))
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res)
};

//User logout
export const logout = async (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true
    };
    res.cookie("token", null, options);
    res.status(200).json({ success: true, message: "Successfully logged out" });
};

//User Profile
export const profile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
};

//User Password update
export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const isCorrect = await user.verifyPassword(oldPassword);
    if (!isCorrect) {
        return next(new HandleError("Incorrect old password", 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("There is a mismatch between the new Password and Confirm Password", 400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res)
}

//User Profile update
export const updateProfile = async (req, res, next) => {
    const { name, email, avatar } = req.body;
    const updatedUserDetails = { name, email };

    if (avatar && avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar?.public_id;

        if (imageId) {
            await cloudinary.uploader.destroy(imageId);
        }

        //Uploading photos to cloudinary (my folder name : "avatars")
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });

        updatedUserDetails.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedUserDetails, { new: true, runValidators: true });
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    })
}

//Get all users
export const getUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
};

//Get Single User
export const getSingleUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new HandleError("User doesn't exist : ", 400));
    }
    res.status(200).json({
        success: true,
        user,
    });
};

//update user role
export const updateUserRole = async (req, res, next) => {
    const { role } = req.body;
    const id = req.params.id;
    const updatedRole = { role };
    const user = await User.findByIdAndUpdate(id, updatedRole, { new: true });
    if (!user) {
        return next(new HandleError("User doesn't exist", 400));
    }
    res.status(200).json({
        success: true,
        user,
    })
};

//delete user
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new HandleError("User doesn't exist", 400));
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "User details deleted successfully"
    })
};