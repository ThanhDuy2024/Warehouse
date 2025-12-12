import { Router } from "express";
import * as authenticationController from "../controllers/authentication.controller"
const router = Router();

router.get("/", authenticationController.login)
export default router;