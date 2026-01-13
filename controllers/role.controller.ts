import { Request, Response } from "express";
import { Roles } from "../models/roles.model";
import { admin } from "../interfaces/admin.middlewares";

export const createRole = async (req: admin, res: Response) => {
    try {
        req.body.createdBy = req.admin.id;
        req.body.updatedBy = req.admin.id;
        
        await Roles.create(req.body);
        res.json({
            code: "success",
            message: "Create role success!!"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Error backend or frontend"
        })
    }
}