import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { RoomCreationType, RoomType } from './room';

export enum Score {
  HOME = 'home',
  AWAY = 'away',
  DRAW = 'draw',
}

export interface MatchType {
  id: string;
  homeTeam: string;
  awayTeam: string;
  officialScore: Score;
  paymentLink: string;
}

export interface MatchCreationType extends Optional<MatchType, 'id'> {}

export const defineMatchModel = (
  sequelizeInstance: SequelizeInstance,
  RoomModel: ModelStatic<Model<RoomType, RoomCreationType>>,
) => {
  const MatchModel = sequelizeInstance.define<
    Model<MatchType, MatchCreationType>
  >('Match', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    homeTeam: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    awayTeam: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    officialScore: {
      type: DataTypes.ENUM(Score.HOME, Score.AWAY, Score.DRAW),
      allowNull: false,
    },
    paymentLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  MatchModel.belongsTo(RoomModel, { foreignKey: 'roomId' });

  return MatchModel;
};
