import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    console.log("Token || ",token);

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
        console.log("Decode: ",decoded)
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
