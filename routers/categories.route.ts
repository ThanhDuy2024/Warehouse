import { Router } from "express";
import { createCategory, getCategory } from "../controllers/categories.controller";

const router = Router();

router.post("/create", createCategory);

router.get("/list", getCategory);
export default router;