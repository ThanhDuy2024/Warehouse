import { Router } from "express";
import authenticationRouter from "./authentication.route";
import warehouse from "./warehouse.route"
import categories from "./categories.route"
import products from "./products.route"
import { middleware } from "../middlewares/admin.middlewares";
const router = Router();

router.use("/authentication", authenticationRouter);

router.use("/warehouse", middleware, warehouse);

router.use("/category", middleware, categories);

router.use("/product", middleware, products);
export default router;