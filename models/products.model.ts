import { DataTypes } from "sequelize";
import { sequelize } from "../configs/database.config";

export const Products = sequelize.define("Products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  warehouseId: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  price: DataTypes.INTEGER,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: DataTypes.INTEGER,
  updatedBy: DataTypes.INTEGER,
  slug: DataTypes.STRING,

  daily_demand: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  lead_time: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  safety_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },

  reorder_point: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true
});

Products.beforeCreate((product:any) => {
  product.reorder_point =
    product.daily_demand * product.lead_time +
    product.safety_stock;
});

Products.beforeUpdate((product:any) => {
  product.reorder_point =
    product.daily_demand * product.lead_time +
    product.safety_stock;
});
