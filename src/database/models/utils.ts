import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { defineUserModel } from './userModel';

export type DbModels = {
  UserModel: ReturnType<typeof defineUserModel>;
};

export const defineModels = (
  sequelizeInstance: SequelizeInstance,
): DbModels => {
  const UserModel = defineUserModel(sequelizeInstance);

  const allModels = {
    UserModel,
  };

  return allModels;
};
