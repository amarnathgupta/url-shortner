import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { validateEmail } from "../validators/email.validators.js";
import { validatePassword } from "../validators/password.validators.js";

export const registerUser = async (req, res) => {
    const {email, password} = req.body;
    console.log(email);
    console.log(password);
    try {
        const emailResult = validateEmail(email);
        if(!emailResult.success) {
            console.log("Email validation failed! || ",emailResult)
            return res.status(400).json({
                message: "Invalid Email address"
            })
        }
        const passwordResult = validatePassword(password);
        if (!passwordResult.success) {
            console.log("Password validation failed! || ",passwordResult)
            return res.status(400).json({ message: passwordResult.message });
        }
        console.log("After e&p validation")
        const existingUser = await User.findOne({email});
        if (existingUser) {
            console.log("User already exists! || ",existingUser)
            return res.status(400).json({message: "Email already exists"});
        }
        const newUser = new User({
            email,
            password
        })
        console.log("New User: || ", newUser)
        await newUser.save();
        console.log("new User Saved")
        const token = jwt.sign({id: newUser._id}, process.env.SECRET_KEY,)
        console.log(token);
        res.cookie('token', `Bearer ${token}`, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 // 1 hour in milliseconds
        })
        return res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        console.log("Kya hai error || ",error)
        return res.status(500).json({
            message: "Failed to register user",
        })
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const emailResult = validateEmail(email);
        console.log("Validated Email");
        if(!emailResult.success) {
            return res.status(400).json({
                message: emailResult.message
            })
        }
        const passwordResult = validatePassword(password);
        
        console.log("Validating Password");
        if (!passwordResult.success) {
            return res.status(400).json({ message: passwordResult.message });
        }
        const user = await User.findOne({email});
        
        console.log("found User: ",user);
        if (!user || !(await user.isValidPassword(password))) {
            return res
            .status(400)
            .json({
                message: "Invalid email or password",
            })
        }
        console.log("Before JWT");
        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        
        console.log("Before Cookie");
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