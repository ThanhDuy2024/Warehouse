import { Response } from "express";
import { Products } from "../models/products.model";
import { admin } from "../interfaces/admin.middlewares";
import slugify from "slugify";
import { CategoriesProducts } from "../models/categoriesProducts.model";
import { Categories } from "../models/categories.model";
import { Warehouse } from "../models/warehouse.model";

export const createProduct = async (req: admin, res: Response) => {
    try {
        if(req.file) {
            req.body.image = req.file.path;
        } else {
            delete req.body.image
        }
        
        let categoryId = null
        if(req.body.categoryId) {
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

        if(datacheckWarehouse == null) {
            return res.status(404).json({
                code: "error",
                message: "Khong tim thay warehouse"
            })
        }
        
        const data = await Products.create(req.body);

        let flagCheckCategory = false
        if(categoryId !== null) {
            for (const item of categoryId) {
                const checkCategory = await Categories.findOne({
                    where: {
                        id: item
                    }
                });

                if(checkCategory == null) {
                    await data.destroy();
                    flagCheckCategory = true
                    return res.status(404).json({
                        code: "error",
                        message: `Khong tim thay category voi id:${item}`
                    })
                };
            }
        }

        if(flagCheckCategory == false) {
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