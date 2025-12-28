import { Router } from "express";
import { createWarehouse } from "../controllers/warehouse.controller";
const router = Router();

router.post("/create", createWarehouse)

export default router