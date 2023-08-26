import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { defineForecastModel } from './forecast';
import { defineMatchModel } from './match';
import { defineRoomModel } from './room';
import { defineUserModel } from './user';
import { definePaymentModel } from './payment';

export type DbModels = {
  UserModel: ReturnType<typeof defineUserModel>;
  RoomModel: ReturnType<typeof defineRoomModel>;
  MatchModel: ReturnType<typeof defineMatchModel>;
  ForecastModel: ReturnType<typeof defineForecastModel>;
  PaymentModel: ReturnType<typeof definePaymentModel>;
};

export const defineModels = (
  sequelizeInstance: SequelizeInstance,
): DbModels => {
  const RoomModel = defineRoomModel(sequelizeInstance);
  const UserModel = defineUserModel(sequelizeInstance);

  const MatchModel = defineMatchModel(sequelizeInstance, RoomModel);

  const ForecastModel = defineForecastModel(
    sequelizeInstance,
    MatchModel,
    UserModel,
  );
  const PaymentModel = definePaymentModel(sequelizeInstance);

  const allModels = {
    RoomModel,
    UserModel,
    MatchModel,
    ForecastModel,
    PaymentModel,
  };

  return allModels;
};
