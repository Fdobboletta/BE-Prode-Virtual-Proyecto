import { sequelizeInstance } from '../index';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CompetitionType {
  id: string;
  name: string;
  country: string;
  description: string;
  reputation: number;
  isCup: boolean;
}

interface CompetitionCreationType extends Optional<CompetitionType, 'id'> {}

export const CompetitionModel = sequelizeInstance.define<
  Model<CompetitionType, CompetitionCreationType>
>('Competition', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reputation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
  isCup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
