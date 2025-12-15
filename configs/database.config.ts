import { Sequelize } from "sequelize"

export const sequelize = new Sequelize('warehouse', String(process.env.DATABASE_NAME), String(process.env.DATABASE_PASSWORD), {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database has connected!");
  } catch (error) {
    console.log("Database has not connected!");
  }
}