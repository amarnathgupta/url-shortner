import { nanoid } from "nanoid";
import { Url } from "../models/url.models";

const shortenURL = async (originalUrl) => {
    try {
        const existingUrl = await Url.findOne({
            originalUrl,
        });
        if (existingUrl) {
            return existingUrl.shortUrl;
        }
        const shortCode = nanoid(11);
        const shortUrl = `http://localhost:3000/${shortCode}`;
    
        const url = new Url({
            originalUrl,
            shortUrl,
            shortCode
        })
        await url.save();
        return shortUrl;
    } catch (error) {
        console.error("Error shortening URL: ",error);
        return {
            error: "Error shortening URL",
        }
    }
}