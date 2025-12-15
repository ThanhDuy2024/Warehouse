import { Router } from "express";
import * as authenticationController from "../controllers/authentication.controller"
import { middleware } from "../middlewares/admin.middlewares";
const router = Router();

router.post("/register", authenticationController.register)

router.post("/login", authenticationController.login);

router.get("/logout", middleware, authenticationController.logout);
export default router;