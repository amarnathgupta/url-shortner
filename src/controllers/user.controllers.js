import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { validateEmail } from "../validators/email.validators.js";
import { validatePassword } from "../validators/password.validators.js";

export const registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const emailResult = validateEmail(email);
        if(!emailResult.success) {
            return res.status(400).json({
                message: emailResult.message
            })
        }
        const passwordResult = validatePassword(password);
        if (!passwordResult.success) {
            return res.status(400).json({ message: passwordResult.message });
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }
        const newUser = new User({
            username,
            email,
            password
        })
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.SECRET_KEY,)
        res.cookie('token', `Bearer ${token}`, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 // 1 hour in milliseconds
        })
        return res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to register user",
        })
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const emailResult = validateEmail(email);
        if(!emailResult.success) {
            return res.status(400).json({
                message: emailResult.message
            })
        }
        const passwordResult = validatePassword(password);
        if (!passwordResult.success) {
            return res.status(400).json({ message: passwordResult.message });
        }
        const user = await User.findOne({email});
        if (!user || !(await User.isValidPassword(password))) {
            return res
            .status(400)
            .json({
                message: "Invalid email or password",
            })
        }
        const token = jwt.sign({id: user._id, email: user.email}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        res.cookie('token', `Bearer ${token}`, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 // 1 hour in milliseconds
        })
        return res.status(200).json({
            message: "User logged in successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to login user",
        })
    }
}
export const logoutUser = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'User logged out successfully' });
};