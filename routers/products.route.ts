import { Router } from "express";
import { createProduct } from "../controllers/products.controller";
import { storage } from "../helpers/cloudinary.helper";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: storage
})

router.post("/create", upload.single("image"), createProduct);

export default router;