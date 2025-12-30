import { Router } from "express";
import { createProduct, getProduct } from "../controllers/products.controller";
import { storage } from "../helpers/cloudinary.helper";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: storage
})

router.post("/create", upload.single("image"), createProduct);

router.get("/list", getProduct);

export default router;