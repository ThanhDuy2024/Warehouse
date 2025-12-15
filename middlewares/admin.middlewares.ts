import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { admin } from "../interfaces/admin.middlewares";
import { Admin } from "../models/admin.model";
export const middleware = async (req: admin, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.adminToken;
        const verifyToken = jwt.verify(token, String(process.env.JWT_SECRET)) as JwtPayload;
        
        const adminsAccount = await Admin.findOne({
            where: {
                email: verifyToken.email
            }
        })
        
        const data = adminsAccount?.dataValues;
        
        req.admin = {
            id: data.adminId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            image: data.image ? data.image : "",  
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Ban hay dang nhap truoc khi goi api nay"
        })
    }
}