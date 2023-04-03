import { sequelizeInstance } from '../index';
import { DataTypes, Model, Optional } from 'sequelize';
import { UserModel } from './userModel';

export interface TeamType {
  id: string;
  name: string;
  logoUrl: string | null;
  mainColor: string;
  secondColor: string | null;
  thirdColor: string | null;
  city: string;
  description: string;
}

interface TeamCreationType extends Optional<TeamType, 'id'> {}

export const TeamModel = sequelizeInstance.define<
  Model<TeamType, TeamCreationType>
>('Team', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mainColor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thirdColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

TeamModel.hasMany(UserModel, { foreignKey: 'teamId' });
