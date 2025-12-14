import { Router } from "express";
import * as authenticationController from "../controllers/authentication.controller"
const router = Router();

router.post("/register", authenticationController.register)

router.post("/login", authenticationController.login);

router.get("/logout", authenticationController.logout);
export default router;