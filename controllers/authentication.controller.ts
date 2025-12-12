import { Request, Response } from "express";
import { Admin } from "../models/admin.model";

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