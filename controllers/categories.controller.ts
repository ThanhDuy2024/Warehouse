import { Response } from "express";
import { admin } from "../interfaces/admin.middlewares";
import slugify from "slugify";
import { Categories } from "../models/categories.model";
import { Admin } from "../models/admin.model";
import moment from "moment";
import { Op } from "sequelize";
import { limit } from "../configs/variable.config";
import { CategoriesProducts } from "../models/categoriesProducts.model";
import { sequelize } from "../configs/database.config";

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
        Categories.hasMany(CategoriesProducts, { foreignKey: 'categoryId' });
        CategoriesProducts.belongsTo(Categories, { foreignKey: 'categoryId' });

        const result = await Categories.findAll({
            attributes: [
                ['id', 'categoryId'],
                [
                    sequelize.fn('COUNT', sequelize.col('CategoriesProducts.productId')),
                    'totalStockProdudct'
                ]
            ],
            include: [
                {
                    model: CategoriesProducts,
                    attributes: [],     // không select cột của bảng join
                    required: false     // LEFT JOIN
                }
            ],
            group: ['Categories.id']
        });

        const countProductInCategory:any = []
        if(result) {
            for (const item of result) {
                countProductInCategory.push(item.dataValues)
            }
        }



        let offset = 0
        const count = await Categories.count();
        const pageQuantity = Math.ceil(Number(count) / limit);
        const { page } = req.query
        if (page && Number(page) > 1 && Number(page) <= pageQuantity) {
            offset = (Number(page) - 1) * limit
        };

        const find: any = {
            where: {},
            offset: offset,
            limit: limit
        }

        //search item
        if (req.query.search && String(req.query.search).trim() !== "") {
            const keyword = slugify(String(req.query.search), {
                lower: true
            });
            find.where.slug = {
                [Op.regexp]: keyword
            }
        };

        //filter isActive
        if (req.query.isActive == "true") {
            find.where.isActive = true
        } else if (req.query.isActive == "false") {
            find.where.isActive = false
        }

        const categories = await Categories.findAll(find);

        const data: Array<object> = []
        for (const item of categories) {
            const rawData:any = {
                id: item.dataValues.id,
                name: item.dataValues.name,
                description: item.dataValues.description,
                isActive: item.dataValues.isActive,
                createdBy: "",
                updatedBy: "",
                createdAt: "",
                updatedAt: ""
            }

            for (const stock of countProductInCategory) {
                if(item.dataValues.id === stock.categoryId) {
                    rawData.totalStockProdudct = stock.totalStockProdudct
                }
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
            data: data,
            pageQuantity: pageQuantity
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

        if (data == null) {
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

export const lockCategory = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const data = await Categories.findOne({
            where: {
                id: id,
                isActive: isActive
            }
        });

        if (data == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay danh muc"
            })
        };

        await data.update({
            isActive: !isActive
        });

        data.save();

        res.json({
            code: "success",
            message: "Lock danh muc thanh cong"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            code: "error",
            message: "Loi lock danh muc"
        })
    }
}