import { sequelizeInstance } from '../index';
import { DataTypes, Model, Optional } from 'sequelize';
import { TeamModel } from './teamModel';

export interface UserType {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  teamId: string | null;
}

interface UserCreationType extends Optional<UserType, 'id'> {}

export const UserModel = sequelizeInstance.define<
  Model<UserType, UserCreationType>
>('User', {
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
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    unique: true,
    references: {
      model: TeamModel,
      key: 'id',
    },
  },
});

UserModel.belongsTo(TeamModel, { foreignKey: 'teamId' });
