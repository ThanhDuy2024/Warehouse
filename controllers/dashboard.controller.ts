import { Request, Response } from "express";
import { Products } from "../models/products.model";
import { sequelize } from "../configs/database.config";
import { Warehouse } from "../models/warehouse.model";
import { Op } from "sequelize";

export const totalDashBoard = async (req: Request, res: Response) => {
    try {
        const rawData:any = {}

        //total price in all warehouse
        const totalPriceValue = await Products.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.literal('Quantity * price')), 'totalInventoryValue']
            ],
            raw: true
        });

        if(totalPriceValue) {
            rawData.totalInventoryValue = totalPriceValue
        } else {
            rawData.totalInventoryValue = {
                totalInventoryValue: 0
            }
        }
        //end total price in all warehouse

        //total active warehouse
        const totalWarehouse = await Warehouse.count({
            where: {
                isActive: true
            }
        });

        if(totalWarehouse) {
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

        if(lowQuantityProduct) {
            rawData.totalLowQuantityProduct = lowQuantityProduct
        } else {
            rawData.totalLowQuantityProduct = 0
        }
        //end low quantity product

        const data:any = {
            totalInventoryValue: Number(rawData.totalInventoryValue.totalInventoryValue),
            totalWarehouse: rawData.totalWarehouse,
            totalLowQuantityProduct: rawData.totalLowQuantityProduct
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