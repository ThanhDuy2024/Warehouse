import { Router } from "express";
import { totalDashBoard } from "../controllers/dashboard.controller";

const router = Router();

router.get("/total", totalDashBoard);

export default router