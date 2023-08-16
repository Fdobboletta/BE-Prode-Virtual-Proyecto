import { RoomCreationType, RoomType } from '../../database/models/room';
import {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnknownError,
} from '../../custom-errors';
import { dbModels } from '../../server';
import { getMercadoPagoPreferenceId } from './mercado-pago';

type CreateRoomType = {
  name: string;
  dueDate: string;
  prizeMoney: number;
  entryPrice: number;
  isActive: boolean;
};

export const createNewRoom = async (
  args: CreateRoomType,
  userId: string,
): Promise<RoomType> => {
  try {
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
      dueDate: new Date(args.dueDate),
      paymentLink: mpPreferenceId,
      isActive: args.isActive || false,
      creatorId: userId,
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

export const getRoomsByCreatorId = async (
  creatorId: string,
): Promise<RoomType[]> => {
  try {
    const rooms = await dbModels.RoomModel.findAll({
      where: {
        creatorId,
      },
    });

    return rooms.map((room) => room.dataValues);
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(
      `No se pudieron obtener las salas del usuario: ${error.message}`,
    );
  }
};
