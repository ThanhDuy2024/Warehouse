import { Router } from "express";
import authenticationRouter from "./authentication.route";
const router = Router();

router.use("/authentication", authenticationRouter);
export default router;