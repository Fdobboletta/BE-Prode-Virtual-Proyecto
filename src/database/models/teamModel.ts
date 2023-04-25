import { DataTypes, Model, Optional } from 'sequelize';
import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';

export interface TeamType {
  id: string;
  name: string;
  logoUrl: string;
  mainColor: string;
  secondColor?: string | null | undefined;
  thirdColor?: string | null | undefined;
  city: string;
  description?: string | null | undefined;
}

export interface TeamCreationType extends Optional<TeamType, 'id'> {}

export const defineTeamModel = (sequelizeInstance: SequelizeInstance) => {
  const TeamModel = sequelizeInstance.define<Model<TeamType, TeamCreationType>>(
    'Team',
    {
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
    },
  );

  return TeamModel;
};
