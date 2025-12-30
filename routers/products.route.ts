import { Router } from "express";
import { createProduct, getProduct, updateProduct } from "../controllers/products.controller";
import { storage } from "../helpers/cloudinary.helper";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: storage
})

router.post("/create", upload.single("image"), createProduct);

router.get("/list", getProduct);

router.put("/update/:id", upload.single("image"), updateProduct)
export default router;