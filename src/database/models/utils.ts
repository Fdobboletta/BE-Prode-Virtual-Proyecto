import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { defineForecastModel } from './forecast';
import { defineMatchModel } from './match';
import { defineRoomModel } from './room';
import { defineUserModel } from './user';
import { defineUserRoomModel } from './user-room';

export type DbModels = {
  UserModel: ReturnType<typeof defineUserModel>;
  RoomModel: ReturnType<typeof defineRoomModel>;
  MatchModel: ReturnType<typeof defineMatchModel>;
};

export const defineModels = (
  sequelizeInstance: SequelizeInstance,
): DbModels => {
  const RoomModel = defineRoomModel(sequelizeInstance);
  const UserModel = defineUserModel(sequelizeInstance);

  const UserRoomModel = defineUserRoomModel(
    sequelizeInstance,
    UserModel,
    RoomModel,
  );
  const MatchModel = defineMatchModel(sequelizeInstance, RoomModel);

  const ForecastModel = defineForecastModel(
    sequelizeInstance,
    MatchModel,
    UserModel,
  );

  const allModels = {
    RoomModel,
    UserModel,
    UserRoomModel,
    MatchModel,
    ForecastModel,
  };

  return allModels;
};
