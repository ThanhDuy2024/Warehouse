import { Response } from "express";
import { admin } from "../interfaces/admin.middlewares";
import slugify from "slugify";
import { Categories } from "../models/categories.model";
import { Admin } from "../models/admin.model";
import moment from "moment";

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

export const getCategory = async (req: admin, res: Response) => {
    try {
        const categories = await Categories.findAll();

        const data:Array<object> = []
        for (const item of categories) {
            const rawData = {
                id: item.dataValues.id,
                name: item.dataValues.name,
                createdBy: "",
                updatedBy: "",
                createdAt: "",
                updatedAt: ""
            }

            const createdAdmin = await Admin.findOne({
                attributes: ["userName"],
                where: {
                    id: item.dataValues.createdBy
                }
            });

            const updatedAdmin = await Admin.findOne({
                attributes: ["userName"],
                where: {
                    id: item.dataValues.updatedBy
                }
            });

            rawData.createdBy = createdAdmin?.dataValues.userName
            rawData.updatedBy = updatedAdmin?.dataValues.userName

            rawData.createdAt = moment(item.dataValues.createdAt).format("HH:mm - DD/MM/YYYY");
            rawData.updatedAt = moment(item.dataValues.updatedAt).format("HH:mm - DD/MM/YYYY");

            data.push(rawData);
        }
        res.json({
            code: "success",
            data: data
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Loi lay data"
        })
    }
}

export const updateCategory = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body

        req.body.slug = slugify(name, {
            lower: true
        });

        const data = await Categories.findOne({
            where: {
                id: id
            }
        });

        if(data == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay danh muc"
            })
        };

        req.body.updatedBy = req.admin.id

        await data.update(req.body);

        data.save();

        res.json({
            code: "success",
            message: "Cap nhat danh muc thanh cong"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Cap nhat danh muc that bai"
        })
    }
}