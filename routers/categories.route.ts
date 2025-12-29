import { Router } from "express";
import { createCategory } from "../controllers/categories.controller";

const router = Router();

router.post("/create", createCategory);

export default router;