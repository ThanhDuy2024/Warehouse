import { Router } from "express";
import authenticationRouter from "./authentication.route";
const router = Router();

router.use("/", authenticationRouter);
export default router;