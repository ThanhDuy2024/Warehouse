import { Router } from "express";
import * as authenticationController from "../controllers/authentication.controller"
const router = Router();

router.post("/register", authenticationController.register)
export default router;