import { Router } from "express";
import userRoutes from "./user.routes.js";
import urlRoutes from "./user.routes.js";

const router = Router();

router.use("/user", userRoutes);
router.use("/url", urlRoutes);

export default router;