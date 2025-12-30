import { Response } from "express";
import { Products } from "../models/products.model";
import { admin } from "../interfaces/admin.middlewares";
import slugify from "slugify";
import { CategoriesProducts } from "../models/categoriesProducts.model";
import { Categories } from "../models/categories.model";
import { Warehouse } from "../models/warehouse.model";
import { Admin } from "../models/admin.model";
import moment from "moment";
import { where } from "sequelize";

export const createProduct = async (req: admin, res: Response) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        } else {
            delete req.body.image
        }

        let categoryId = null
        if (req.body.categoryId) {
            categoryId = JSON.parse(req.body.categoryId);
            delete req.body.categoryId
        }

        req.body.createdBy = req.admin.id;
        req.body.updatedBy = req.admin.id;
        req.body.slug = slugify(req.body.name, {
            lower: true
        });

        const datacheckWarehouse = await Warehouse.findOne({
            where: {
                id: req.body.warehouseId
            }
        })

        if (datacheckWarehouse == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay warehouse"
            })
        }

        const data = await Products.create(req.body);

        let flagCheckCategory = false
        if (categoryId !== null) {
            for (const item of categoryId) {
                const checkCategory = await Categories.findOne({
                    where: {
                        id: item
                    }
                });

                if (checkCategory == null) {
                    await data.destroy();
                    flagCheckCategory = true
                    return res.status(404).json({
                        code: "error",
                        message: `Khong tim thay category voi id:${item}`
                    })
                };
            }
        }

        if (flagCheckCategory == false) {
            for (const item of categoryId) {
                await CategoriesProducts.create({
                    productId: data.dataValues.id,
                    categoryId: item
                })
            }
        }


        res.json({
            code: "success",
            message: "Tao san pham thanh cong"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Tao san pham that bai"
        })
    }
}

export const getProduct = async (req: admin, res: Response) => {
    try {

        Warehouse.hasMany(Products, { foreignKey: "warehouseId" });
        Products.belongsTo(Warehouse, { foreignKey: "warehouseId" });

        const productList = await Products.findAll({
            include: [{
                model: Warehouse,
                attributes: ['id', 'name'],
                required: true //inner join
            }],
            order: [
                ['id', 'asc']
            ]
        });

        const data: any = []
        for (const item of productList) {
            const rawData = {
                id: item.dataValues.id,
                name: item.dataValues.name,
                image: item.dataValues.image,
                warehouseId: item.dataValues.warehouseId,
                warehouseName: item.dataValues.Warehouse.dataValues.name,
                quantity: item.dataValues.quantity,
                isActive: item.dataValues.isActive,
                categoryIds: [],
                createdBy: "",
                updatedBy: "",
                createdAt: "",
                updatedAt: ""
            }

            const createdByAdmin = await Admin.findOne({
                where: {
                    id: item.dataValues.createdBy
                }
            });

            if (createdByAdmin !== null) {
                rawData.createdBy = createdByAdmin.dataValues.userName
            }

            const updatedByAdmin = await Admin.findOne({
                where: {
                    id: item.dataValues.updatedBy
                }
            });

            if (updatedByAdmin !== null) {
                rawData.updatedBy = updatedByAdmin.dataValues.userName
            }

            rawData.createdAt = moment(item.dataValues.createdAt).format("HH:mm DD/MM/YYYY");
            rawData.updatedAt = moment(item.dataValues.updatedAt).format("HH:mm DD/MM/YYYY");

            data.push(rawData);
        };

        for (const item of data) {
            const getIdCategory = await CategoriesProducts.findAll({
                where: {
                    productId: item.id
                }
            })

            if (getIdCategory !== null) {
                for (const cId of getIdCategory) {
                    const queryCategory = await Categories.findOne({
                        where: {
                            id: cId.dataValues.categoryId
                        }
                    });

                    if (queryCategory !== null) {
                        const dataCategory = {
                            categoryId: queryCategory.dataValues.id,
                            categoryName: queryCategory.dataValues.name
                        }
                        item.categoryIds.push(dataCategory);
                    }
                }
            }
        }


        res.json({
            code: "success",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            code: "error",
            message: "Loi lay danh sach san pham"
        })
    }
}

export const updateProduct = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Products.findOne({
            where: {
                id: id
            }
        });

        if(product == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay san pham"
            })
        }

        if (req.file) {
            req.body.image = req.file.path;
        } else {
            delete req.body.image;
        };

        const checkWarehouseId = await Warehouse.findOne({
            where: {
                id: req.body.warehouseId,
            }
        });

        if (checkWarehouseId == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay warehouse"
            })
        };

        let categoryId = null
        if (req.body.categoryId) {
            categoryId = JSON.parse(req.body.categoryId);
            delete req.body.categoryId
        };

        let flagCheck = false
        for (const item of categoryId) {
            const checkCategoryId = await Categories.findOne({
                where: {
                    id: item
                }
            });

            if (checkCategoryId == null) {
                flagCheck = true
                break;
            }
        };

        if (flagCheck == true) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay category"
            })
        };

        req.body.updatedBy = req.admin.id;

        await product.update(req.body);
        product.save();

        const findCategoryAndProduct = await CategoriesProducts.findAll({
            where: {
                productId: id
            }
        });

        if(findCategoryAndProduct !== null) {
            for (const item of findCategoryAndProduct) {
                item.destroy();
            }
        }

        for (const item of categoryId) {
            await CategoriesProducts.create({
                productId: id,
                categoryId: item
            });
        }

        res.json({
            code: "success",
            message: "Cap nhat san pham thanh cong"
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            code: "error",
            message: "Loi cap nhat san pham"
        })
    }
}

export const lockProduct = async (req: admin, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const getProduct = await Products.findOne({
            where: {
                id: id
            }
        });

        if(getProduct == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay san pham"
            })
        };

        await getProduct.update({
            isActive: !isActive
        });

        getProduct.save();
        res.json({
            code: "success",
            message: "Lock san pham thanh cong"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Lock san pham loi"
        })
    }
}