import { Sequelize } from 'sequelize';

export const sequelizeInstance = new Sequelize(process.env.DB_URL || '');

export const connectDatabase = async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connected to database!');

    // Sync the models with the database
    await sequelizeInstance.sync();

    console.log('📊 -> Database schema synchronized successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
