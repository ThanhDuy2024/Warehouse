import { Router } from "express";
import { createProduct, getProduct, lockProduct, orderMore, updateProduct } from "../controllers/products.controller";
import { storage } from "../helpers/cloudinary.helper";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: storage
})

router.post("/create", upload.single("image"), createProduct);

router.get("/list", getProduct);

router.put("/update/:id", upload.single("image"), updateProduct);

router.put("/lock/:id", lockProduct);

router.post("/order_item/:id", orderMore);
export default router;