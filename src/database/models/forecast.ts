import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { MatchType, MatchCreationType } from './match';
import { UserCreationType, UserType } from './user';

export enum Score {
  HOME = 'home',
  AWAY = 'away',
  DRAW = 'draw',
}

export interface ForecastType {
  id: string;
  matchId: string;
  playerId: string;
  estimatedScore: Score | null | undefined;
}

export interface ForecastCreationType extends Optional<ForecastType, 'id'> {}

export const defineForecastModel = (
  sequelizeInstance: SequelizeInstance,
  MatchModel: ModelStatic<Model<MatchType, MatchCreationType>>,
  UserModel: ModelStatic<Model<UserType, UserCreationType>>,
) => {
  const ForecastModel = sequelizeInstance.define<
    Model<ForecastType, ForecastCreationType>
  >('Forecast', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: MatchModel,
        key: 'id',
      },
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    estimatedScore: {
      type: DataTypes.ENUM(Score.HOME, Score.AWAY, Score.DRAW),
    },
  });

  ForecastModel.belongsTo(MatchModel, { foreignKey: 'matchId' });
  ForecastModel.belongsTo(UserModel, { foreignKey: 'playerId' });

  return ForecastModel;
};
