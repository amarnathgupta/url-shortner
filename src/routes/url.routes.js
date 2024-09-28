import express, { Router } from "express";
import { shortenURL } from "../controllers/url.controllers.js";
import urlValidator from "../validators/url.validators.js";
import { Url } from "../models/url.models.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Post route to shorten a url
router.post("/shorten", authMiddleware, async (req, res) => {
    const { originalURL } = req.body;

    // Ensure the originalURL is provided in the request
    if (!originalURL) {
        return res.status(400).json({ error: "originalURL is required" });
    }

    // Validate URL using zod
    const result = urlValidator.safeParse(originalURL);
    if (!result.success) {
        return res.status(400).json({ error: result.error.message });
    }

    // Shorten the URL
    const customUrl = await shortenURL(originalURL, req.user.id);
    if (!customUrl.success) {
        return res.status(500).json({ message: customUrl.message });
    }

    return res.status(201).json({
        message: customUrl.message,
        shortURL: customUrl.data,
    });
});


// GET route to redirect to the original URL
router.get("/:shortCode", async (req, res) => {
    const shortCode = req.params.shortCode;

    try {
        const url = await Url.findOne({ shortCode });
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        // Increment click count
        url.clicks += 1;
        await url.save();

        // Redirect to the original URL
        return res.redirect(url.originalUrl);
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
});


export default router;