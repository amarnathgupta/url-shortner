import { Router } from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import urlValidator from "../validators/url.validators.js";
import { shortenURL } from "../controllers/url.controllers.js";
import { Url } from "../models/url.models.js";


const router = Router();


// Post route to shorten a url
router.post("/shorten", authMiddleware, async (req, res) => {
    const { originalURL } = req.body;

    // Ensure the originalURL is provided in the request
    if (!originalURL) {
        return res.status(400).json({ error: "originalURL is required" });
    }
    console.log(originalURL)

    // Validate URL using zod
    const result = urlValidator.safeParse(originalURL);
    if (!result.success) {
        return res.status(400).json({ error: result.error.message });
    }
    console.log("Result: ",result)

    // Shorten the URL
    const customUrl = await shortenURL(originalURL, req.user.id);
    if (!customUrl.success) {
        return res.status(500).json({ message: customUrl.message });
    }
    console.log("Custom URL: ", customUrl);

    return res.status(201).json({
        message: customUrl.message,
        shortURL: customUrl.data,
    });
});

export default router;