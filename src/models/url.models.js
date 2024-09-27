import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true,
        validate: {
            validator: function(url) {
                return /^https?:\/\/[^\s]+$/i.test(url);
            },
            message: 'Invalid URL'
        }
    },
    shortUrl: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 30 * 24 * 60 * 60 *1000,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        default: "",
    },
    clicks: {
        type: Number,
        default: 0,
    }

}, {
    timestamps: true
});

export const Url = mongoose.model('Url', urlSchema);