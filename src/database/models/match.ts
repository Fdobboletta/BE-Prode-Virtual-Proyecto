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
  officialScore: Score | null | undefined;
  startDate: Date;
  roomId: string;
}

export interface MatchCreationType
  extends Optional<MatchType, 'id' | 'officialScore'> {
  roomId: string;
}

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
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    officialScore: {
      type: DataTypes.ENUM(Score.HOME, Score.AWAY, Score.DRAW),
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Rooms',
        key: 'id',
      },
    },
  });

  MatchModel.belongsTo(RoomModel, { foreignKey: 'roomId' });

  return MatchModel;
};
