import { Request, Response } from "express";
import { admin } from "../interfaces/admin.middlewares";
import slugify from "slugify";
import { Categories } from "../models/categories.model";

export const createCategory = async (req: admin, res: Response) => {
    try {
        req.body.createdBy = req.admin.id
        req.body.updatedBy = req.admin.id
        req.body.slug = slugify(req.body.name, {
            lower: true
        });

        await Categories.create(req.body);
        
        res.json({
            code: "success",
            message: "Tao danh muc thanh cong"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Tao danh muc loi"
        })
    }
}