import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user'],
    },
    name: {
        type: String,
        default: function() {
            return this.username;
        }
    }
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password"))
        next()
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = model("User", userSchema);