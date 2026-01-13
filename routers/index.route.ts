import { Router } from "express";
import authenticationRouter from "./authentication.route";
import warehouse from "./warehouse.route"
import categories from "./categories.route"
import products from "./products.route"
import dashboard from "./dashboard.route";
import role from "./role.route";
import { middleware } from "../middlewares/admin.middlewares";
const router = Router();

router.use("/authentication", authenticationRouter);

router.use("/warehouse", middleware, warehouse);

router.use("/category", middleware, categories);

router.use("/product", middleware, products);

router.use("/dashboard", middleware, dashboard);

router.use("/role", middleware, role);
export default router;