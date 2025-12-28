import { Router } from "express";
import multer from "multer";
import { createWarehouse, getWarehouse, lockWarehouse, updateWarehouse } from "../controllers/warehouse.controller";
import { storage } from "../helpers/cloudinary.helper";
const router = Router();

const upload = multer({
    storage: storage
})
router.post("/create", upload.single("image"), createWarehouse)

router.get("/list", getWarehouse)

router.put("/update/:id", upload.single("image"), updateWarehouse);

router.put("/lock/:id", lockWarehouse);
export default router