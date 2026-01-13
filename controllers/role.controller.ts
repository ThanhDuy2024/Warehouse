import { Request, Response } from "express";
import { Roles } from "../models/roles.model";
import { admin } from "../interfaces/admin.middlewares";
import { Admin } from "../models/admin.model";
import moment from "moment";
import slugify from "slugify";
import { Op } from "sequelize";
import { limit } from "../configs/variable.config";

export const createRole = async (req: admin, res: Response) => {
    try {
        req.body.createdBy = req.admin.id;
        req.body.updatedBy = req.admin.id;
        req.body.slug = slugify(String(req.body.name), {
            lower: true
        });

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

export const getRole = async (req: Request, res: Response) => {
    try {

        //pagination
        let offset = 0
        const count = await Roles.count();
        const pageQuantity = Math.ceil(Number(count) / limit);
        const { isActive, page } = req.query
        if (page && Number(page) > 1 && Number(page) <= pageQuantity) {
            offset = (Number(page) - 1) * limit
        }
        //end pagination

        const find: any = {
            where: {
            },
            offset: offset,
            limit: limit,
            order: [
                ["updatedAt", "desc"]
            ]
        };

        //status filter
        if (isActive == "true") {
            find.where.isActive = true
        } else if (isActive == "false") {
            find.where.isActive = false
        }
        //end status filter

        //search
        if (req.query.search && String(req.query.search).trim() !== "") {
            const keyword = slugify(String(req.query.search), {
                lower: true
            });

            find.where.slug = {
                [Op.regexp]: keyword
            }
        }
        //end search

        const getRoles = await Roles.findAll(find);

        const data: any = [];

        for (const item of getRoles) {
            const rawData: any = {
                id: item.dataValues.id,
                name: item.dataValues.name,
                isActive: item.dataValues.isActive,
                createdBy: "",
                updatedBy: ""
            };

            if (item.dataValues.createdBy) {
                const user = await Admin.findOne({
                    where: {
                        id: item.dataValues.createdBy
                    }
                });

                if (user) {
                    rawData.createdBy = {
                        id: item.dataValues.createdBy,
                        name: user.dataValues.userName
                    }
                }
            }

            if (item.dataValues.updatedBy) {
                const user = await Admin.findOne({
                    where: {
                        id: item.dataValues.updatedBy,
                    }
                })

                if (user) {
                    rawData.updatedBy = {
                        id: item.dataValues.id,
                        name: user.dataValues.userName,
                    }
                }
            }

            rawData.createdAt = moment(item.dataValues.createdAt).format("HH:mm DD/MM/YYYY");
            rawData.updatedAt = moment(item.dataValues.updatedAt).format("HH:mm DD/MM/YYYY");

            data.push(rawData);
        }

        res.json({
            code: "success",
            data: data,
            pageQuantity: pageQuantity
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Error backend or frontend!"
        })
    }
}

export const updateRole = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;

        const role = await Roles.findOne({
            where: {
                id: id
            }
        });

        if (!role) {
            return res.status(404).json({
                code: "error"
            })
        };

        req.body.updatedBy = req.admin.id;
        req.body.slug = slugify(String(req.body.name), {
            lower: true
        });

        const updateRole = await role.update(req.body);
        await updateRole.save();

        res.json({
            code: "success",
            message: "update role success",
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Error backend or frontend!"
        })
    }
}

export const lockRole = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const role = await Roles.findOne({
            where: {
                id: id
            }
        });

        if (!role) {
            return res.status(404).json({
                code: "error"
            })
        };

        await role.update({
            isActive: !isActive
        });

        await role.save();

        console.log(!isActive)
        res.json({
            code: "success",
            message: "lock role success"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Error backend or frontend"
        })
    }
}