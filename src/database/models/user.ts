import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export enum UserRole {
  ADMIN = 'admin',
  PLAYER = 'player',
}

export interface UserType {
  id: string;
  email: string;
  address: string;
  cellphone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  termsAccepted: boolean;
  mercadoPagoAccessToken: string | null;
}

export interface UserCreationType
  extends Optional<UserType, 'id' | 'mercadoPagoAccessToken'> {}

export const defineUserModel = (sequelizeInstance: SequelizeInstance) => {
  const UserModel = sequelizeInstance.define<Model<UserType, UserCreationType>>(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cellphone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(UserRole.ADMIN, UserRole.PLAYER),
        defaultValue: UserRole.PLAYER,
        allowNull: false,
      },
      termsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mercadoPagoAccessToken: {
        type: DataTypes.STRING || null,
        allowNull: true,
      },
    },
  );

  return UserModel;
};
