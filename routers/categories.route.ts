import { Router } from "express";
import { createCategory, getCategory, updateCategory } from "../controllers/categories.controller";

const router = Router();

router.post("/create", createCategory);

router.get("/list", getCategory);

router.put("/update/:id", updateCategory);
export default router;