import { nanoid } from "nanoid";
import { Url } from "../models/url.models.js";

export const shortenURL = async (originalUrl, userId) => {
    try {
        const existingUrl = await Url.findOne({
            originalUrl,
            owner: userId
        });
        if (existingUrl) {
            return { 
                success: true, 
                message: "Url existed!", 
                data: existingUrl.shortUrl 
            };
        }
        const shortCode = nanoid(11);
        const shortUrl = `http://localhost:3000/${shortCode}`;
    
        const url = new Url({
            originalUrl,
            shortUrl,
            shortCode,
            owner: userId
        })
        await url.save();
        return {
            success: true,
            message: "URL shortened successfully",
            data: shortUrl
        };
    } catch (error) {
        return {
            success: false,
            message: "Error shortening URL",
            data: error.message
        }
    }
}