import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Url } from "./models/url.models.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", router);

// GET route to redirect to the original URL
app.get("/:shortCode", async (req, res) => {
    const shortCode = req.params.shortCode;
    console.log(shortCode)

    try {
        const url = await Url.findOne({ shortCode });
        console.log(url);
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

export default app;