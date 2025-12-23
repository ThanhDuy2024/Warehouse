import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { admin } from "../interfaces/admin.middlewares";
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
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const account = await Admin.findOne({
      where: {
        email: email,
      }
    });

    if(!account) {
      return res.status(404).json({
        code: "error",
        message: "Email hoặc mật khẩu không đúng!"
      })
    };

    const data = account.dataValues;

    const checkPassword = bcrypt.compareSync(String(password), data.password);

    if(!checkPassword) {
      return res.status(404).json({
        code: "error",
        message: "Email hoặc mật khẩu không đúng!"
      })
    };

    const token = jwt.sign({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    }, String(process.env.JWT_SECRET));

    res.cookie("adminToken", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: String(process.env.ENVIROIMENT) == "dev" ? false : true,
      sameSite: "lax",
    });

    res.json({
      code: "success",
      message: "Đăng nhập thành công"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "Đăng nhập thất bại"
    })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("adminToken")
    res.json({
      code: "success",
      message: "Đăng xuất thành công"
    })
  } catch (error) {
    res.status(400).json({
      code: "error",
      message: "Đăng xuất thất bại"
    })
  }
}

export const getProfile = async (req: admin, res: Response) => {
  try {
    res.json({
      code: "success",
      data: req.admin
    })
  } catch (error) {
    res.status(400).json({
      code: "error",
      message: "Loi phan get profile"
    })
  }
}