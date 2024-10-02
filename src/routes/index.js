import { Router } from "express";
import userRoutes from "./user.routes.js";
import urlRoutes from "./url.routes.js";

const router = Router();

router.use("/user", userRoutes);
router.use("/url", urlRoutes);

export default router;