import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { defineForecastModel } from './forecast';
import { defineMatchModel } from './match';
import { defineRoomModel } from './room';
import { defineUserModel } from './user';
import { defineParticipantModel } from './participant';

export type DbModels = {
  UserModel: ReturnType<typeof defineUserModel>;
  RoomModel: ReturnType<typeof defineRoomModel>;
  MatchModel: ReturnType<typeof defineMatchModel>;
  ForecastModel: ReturnType<typeof defineForecastModel>;
  ParticipantModel: ReturnType<typeof defineParticipantModel>;
};

export const defineModels = (
  sequelizeInstance: SequelizeInstance,
): DbModels => {
  const UserModel = defineUserModel(sequelizeInstance);

  const RoomModel = defineRoomModel(sequelizeInstance, UserModel);

  const MatchModel = defineMatchModel(sequelizeInstance, RoomModel);

  const ForecastModel = defineForecastModel(
    sequelizeInstance,
    MatchModel,
    UserModel,
  );
  const ParticipantModel = defineParticipantModel(
    sequelizeInstance,
    RoomModel,
    UserModel,
  );

  const allModels = {
    RoomModel,
    UserModel,
    MatchModel,
    ForecastModel,
    ParticipantModel,
  };

  return allModels;
};
