import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import bcrypt from "bcryptjs"
export const register = async (req: Request, res: Response) => {
  try {
    const email = await Admin.findOne({
      where: {
        email: req.body.email
      }
    });

    if(email) {
      return res.status(400).json({
        code: "error",
        message: "email này đã được đăng ký"
      });
    };
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(String(req.body.password), salt);
    req.body.password = hash;
    
    await Admin.create(req.body);
    res.json({
      code: "success",
      message: "Đăng ký thành công!"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "Đăng ký thất bại!"
    })
  }
}