import { DataTypes } from "sequelize";
import { sequelize } from "../configs/database.config";

export const CategoriesProducts = sequelize.define("CategoriesProducts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
    },
    categoryId: {
        type: DataTypes.INTEGER,
    },
})

sequelize.sync({ alter: true });