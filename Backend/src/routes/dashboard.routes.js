import { Router } from "express";
import { getDashboardOverview } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Dashboard overview
router.route("/overview").get(getDashboardOverview);

export default router;