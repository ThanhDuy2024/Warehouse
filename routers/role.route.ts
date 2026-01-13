import { Router } from "express";
import { createRole, getRole } from "../controllers/role.controller";

const router = Router();

router.post("/create", createRole);

router.get("/list", getRole);

export default router;