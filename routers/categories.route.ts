import { Router } from "express";
import { createCategory, getCategory, lockCategory, updateCategory } from "../controllers/categories.controller";

const router = Router();

router.post("/create", createCategory);

router.get("/list", getCategory);

router.put("/update/:id", updateCategory);

router.put("/lock/:id", lockCategory);
export default router;