import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/index.js";

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error("Error: ", error);
    })
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port ", process.env.PORT);
    });
})
.catch((err) => {
    console.error("Error while connecting to MongoDB || ",err);
    }
);