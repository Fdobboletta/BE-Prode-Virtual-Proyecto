import { Sequelize } from 'sequelize';

export const sequelizeInstance = new Sequelize(process.env.DB_URL || '', {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connected to database!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
