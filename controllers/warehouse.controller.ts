import { Response } from "express";
import { admin } from "../interfaces/admin.middlewares";
import { Warehouse } from "../models/warehouse.model";
import moment from "moment";
import { Admin } from "../models/admin.model";
import slugify from "slugify";

export const createWarehouse = async (req: admin, res: Response) => {
    try {
        if(req.file) {
            req.body.image = req.file.path
        } else {
            delete req.body.image
        }

        req.body.createdBy = req.admin.id
        req.body.updatedBy = req.admin.id

        req.body.slug = slugify(req.body.name, {
            lower: true
        });

        await Warehouse.create(req.body);

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

export const getWarehouse = async (req: admin, res: Response) => {
    try {
        const warehouseList = await Warehouse.findAll();

        const data:Array<object> = []

        for (const item of warehouseList) {
            const rawData = {
                id: item.dataValues.id,
                name: item.dataValues.name,
                address: item.dataValues.address,
                image: item.dataValues.image || "",
                isActive: item.dataValues.isActive,
                createdBy: "",
                updatedBy: "",
                createdAt: "",
                updatedAt: ""
            }

            const createdAtFormat = moment(item.dataValues.createdAt).format("HH:mm - DD/MM/YYYY")
            const updatedAtFormat = moment(item.dataValues.updatedAt).format("HH:mm - DD/MM/YYYY")
            rawData.createdAt = createdAtFormat;
            rawData.updatedAt = updatedAtFormat;
            
            const userCreated = await Admin.findOne({
                attributes: ['userName'],
                where: {
                    id: item.dataValues.createdBy,
                    isActive: true
                }
            })

            const userUpdated = await Admin.findOne({
                attributes: ['userName'],
                where: {
                    id: item.dataValues.updatedBy,
                    isActive: true
                }
            })

            rawData.createdBy = userCreated?.dataValues.userName
            rawData.updatedBy = userUpdated?.dataValues.userName

            data.push(rawData);
        }
        
        res.json({
            code: "success",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            code: "error",
            message: "Loi nhan data"
        })
    }
}

export const updateWarehouse = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;

        if(req.file) {
            req.body.image = req.file.path
        } else {
            delete req.body.image
        }

        const dataCheck = await Warehouse.findOne({
            where: { id: id}
        })

        if(dataCheck == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay kho can cap nhat"
            })
        };

        req.body.slug = slugify(req.body.name, {
            lower: true
        })

        await dataCheck.update(req.body);

        dataCheck.save();

        res.json({
            code: "success",
            message: "Cap nhat thanh cong warehouse"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Cap nhat du lieu loi"
        })
    }
}

export const lockWarehouse = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body 
        const dataCheck = await Warehouse.findOne({
            where: {
                id: id,
                isActive: isActive
            }
        })

        if(dataCheck == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay warehouse"
            })
        }

        await dataCheck.update({
            isActive: !isActive
        });

        dataCheck.save();
    
        res.json({
            code: "success",
            message: "Khoa warehouse thanh cong"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Khoa warehouse that bai"
        })
    }
}