import { RoomCreationType, RoomType } from '../../database/models/room';
import {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnknownError,
} from '../../custom-errors';
import { dbModels } from '../../server';
import { getMercadoPagoPreferenceId } from './mercado-pago';

export const createNewRoom = async (
  args: RoomCreationType,
  userId: string,
): Promise<RoomType> => {
  try {
    // Validate input
    if (
      !args.name ||
      args.entryPrice === undefined ||
      args.prizeMoney === undefined ||
      !args.dueDate
    ) {
      throw new BadRequestError('Todos los campos son requeridos.');
    }

    const user = await dbModels.UserModel.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const mpPreferenceId = await getMercadoPagoPreferenceId({
      user_access_token: user.dataValues.mercadoPagoAccessToken,
      name: args.name,
      entry_price: args.entryPrice,
    });

    // Create new room in the database
    const room = await dbModels.RoomModel.create({
      name: args.name,
      entryPrice: args.entryPrice,
      prizeMoney: args.prizeMoney,
      dueDate: args.dueDate,
      paymentLink: mpPreferenceId,
      isActive: args.isActive || false,
    });

    return room.dataValues;
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError();
  }
};
