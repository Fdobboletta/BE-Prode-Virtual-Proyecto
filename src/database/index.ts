import { Sequelize } from 'sequelize';

export const sequelizeInstance = new Sequelize(process.env.DB_URL || '');

export const connectDatabase = async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connected to database!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
