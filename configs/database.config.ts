const { Sequelize } = require('sequelize');

export const sequelize = new Sequelize('warehouse', 'root', 'thanhduy140', {
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