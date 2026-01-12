import { Router } from "express";
import { lowStockProduct, totalDashBoard } from "../controllers/dashboard.controller";

const router = Router();

router.get("/total", totalDashBoard);

router.get("/lowProduct", lowStockProduct);
export default router