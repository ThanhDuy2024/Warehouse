import { Router } from "express";
import { createRole, getRole, lockRole, updateRole } from "../controllers/role.controller";

const router = Router();

router.post("/create", createRole);

router.get("/list", getRole);

router.put("/update/:id", updateRole);

router.put("/lock/:id", lockRole);

export default router;