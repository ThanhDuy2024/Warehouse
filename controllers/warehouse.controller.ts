import { Request, Response } from "express";

export const createWarehouse = (req: Request, res: Response) => {
    try {
        res.json({
            code: "success",
            message: "Tao nha kho thanh cong"
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            code: "error",
            message: "Tao kho loi"
        })
    }
}