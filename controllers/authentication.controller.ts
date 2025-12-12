import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  try {
    res.send("dat la trang dang nhap")
  } catch (error) {
    res.send(error);
  }
}