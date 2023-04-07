import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

enum PositionZone {
  ARQ = 'ARQ',
  DEF = 'DEF',
  MED = 'MED',
  DEL = 'DEL',
}

export interface PositionType {
  id: string;
  name: string;
  abbreviation: string;
  zone: PositionZone;
}

export interface PositionCreationType extends Optional<PositionType, 'id'> {}

export const definePositionModel = (sequelizeInstance: SequelizeInstance) => {
  const PositionModel = sequelizeInstance.define<
    Model<PositionType, PositionCreationType>
  >('Position', {
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
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    zone: {
      type: DataTypes.ENUM('ARQ', 'DEF', 'MED', 'DEL'),
      allowNull: false,
    },
  });

  return PositionModel;
};
