import { Request, Response } from "express";
import { Products } from "../models/products.model";
import { sequelize } from "../configs/database.config";
import { Warehouse } from "../models/warehouse.model";
import { Op, where, col } from "sequelize";
import { limit } from "../configs/variable.config";

export const totalDashBoard = async (req: Request, res: Response) => {
    try {
        const rawData: any = {}

        //total price in all warehouse
        const totalPriceValue = await Products.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.literal('Quantity * price')), 'totalInventoryValue']
            ],
            raw: true
        });

        if (totalPriceValue) {
            rawData.totalInventoryValue = totalPriceValue
        } else {
            rawData.totalInventoryValue = {
                totalInventoryValue: 0
            }
        }
        //end total price in all warehouse

        //total product
        const totalProduct = await Products.count();
        //total product

        //total active warehouse
        const totalWarehouse = await Warehouse.count({
            where: {
                isActive: true
            }
        });

        if (totalWarehouse) {
            rawData.totalWarehouse = totalWarehouse
        } else {
            rawData.totalWarehouse = 0
        }
        //end total active warehouse

        //Low Quantity Product
        const lowQuantityProduct = await Products.count({
            where: {
                quantity: {
                    [Op.lte]: 100
                }
            }
        });

        if (lowQuantityProduct) {
            rawData.totalLowQuantityProduct = lowQuantityProduct
        } else {
            rawData.totalLowQuantityProduct = 0
        }
        //end low quantity product

        const data: any = {
            totalInventoryValue: Number(rawData.totalInventoryValue.totalInventoryValue),
            totalWarehouse: rawData.totalWarehouse,
            totalLowQuantityProduct: rawData.totalLowQuantityProduct,
            totalProduct: totalProduct || 0
        };

        res.json({
            code: "success",
            data: data
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Loi totalDashboard"
        })
    }
}

export const lowStockProduct = async (req: Request, res: Response) => {
    try {
        //pagination
        const countProduct = await Products.count({
            where: {
                quantity: {
                    [Op.lte]: 100
                }
            }
        });
        const pageQuantity = Math.ceil(countProduct / limit);
        let offset = 0;

        if (req.query.page && Number(req.query.page) > 0 && Number(req.query.page) <= pageQuantity) {
            offset = (Number(req.query.page) - 1) * limit
        };
        //end pagination
        const lowProduct = await Products.findAll({
            attributes: [
                "id",
                "name",
                "image",
                "quantity",
                "threshold",
                "isActive",
            ],
            where: where(
                col('threshold'),
                Op.gt,
                col('quantity')
            ),
            offset: offset,
            limit: limit
        });

        res.json({
            code: "success",
            data: lowProduct,
            pageQuantity: pageQuantity
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            code: "error",
            message: "Loi low stock product"
        })
    }
}