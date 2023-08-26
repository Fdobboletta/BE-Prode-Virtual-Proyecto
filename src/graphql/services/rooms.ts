import { RoomCreationType, RoomType } from '../../database/models/room';
import {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnknownError,
} from '../../custom-errors';
import { dbModels } from '../../server';
import { getMercadoPagoPreferenceId } from './mercado-pago';
import { PaymentType } from '../../database/models/payment';
import { payment } from 'mercadopago';
import { Model } from 'sequelize';

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

export const activateRoom = async (roomId: string): Promise<RoomType> => {
  try {
    const room = await dbModels.RoomModel.findByPk(roomId);
    if (!room) {
      throw new NotFoundError('Sala no encontrada o inexistente.');
    }
    await room.update({ isActive: true });
    return room.dataValues;
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(`No fue posible publicar su sala: ${error.message}`);
  }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    const room = await dbModels.RoomModel.findByPk(roomId);
    if (!room) {
      throw new NotFoundError('Sala no encontrada o inexistente.');
    }
    await room.destroy();
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(`No fue posible eliminar la sala: ${error.message}`);
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

export const getActiveRooms = async (): Promise<RoomType[]> => {
  try {
    const rooms = await dbModels.RoomModel.findAll({
      where: {
        isActive: true,
      },
    });

    return rooms.map((room) => room.dataValues);
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(
      `No se pudieron obtener las salas: ${error.message}`,
    );
  }
};

export const getRoomById = async (roomId: string): Promise<RoomType> => {
  try {
    const room = await dbModels.RoomModel.findByPk(roomId);
    if (!room) {
      throw new NotFoundError(
        'No se pudo encontrar la sala con el ID solicitado',
      );
    }

    return room.dataValues;
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(`Error: ${error.message}`);
  }
};

type PaymentWithRoom = PaymentType & {
  room: Model<RoomType, RoomCreationType>;
};

export const getUserPayedRooms = async (
  userId: string,
): Promise<RoomType[]> => {
  try {
    const payments = (
      await dbModels.PaymentModel.findAll({
        where: { playerId: userId },
        include: { model: dbModels.RoomModel, as: 'room' },
      })
    ).map((payment) => payment.dataValues);

    if (!payments) {
      throw new NotFoundError(
        'No se pudo encontrar el pago con el ID solicitado',
      );
    }

    return payments.map((payment) => {
      const paymentWithRoom = payment as PaymentWithRoom;

      return paymentWithRoom.room.dataValues;
    });
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(`Error: ${error.message}`);
  }
};

export const updateRoom = async (
  roomId: string,
  updates: Partial<CreateRoomType>,
  userId: string,
): Promise<RoomType> => {
  try {
    const room = await dbModels.RoomModel.findByPk(roomId);
    if (!room) {
      throw new NotFoundError('Sala no encontrada o inexistente.');
    }

    const user = await dbModels.UserModel.findByPk(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado.');
    }

    const mpPreferenceId = await getMercadoPagoPreferenceId({
      user_access_token: user.dataValues.mercadoPagoAccessToken,
      name: updates.name || room.dataValues.name,
      entry_price: updates.entryPrice || room.dataValues.entryPrice,
    });

    await room.update({
      name: updates.name || room.dataValues.name,
      entryPrice: updates.entryPrice || room.dataValues.entryPrice,
      prizeMoney: updates.prizeMoney || room.dataValues.prizeMoney,
      dueDate: updates.dueDate
        ? new Date(updates.dueDate)
        : room.dataValues.dueDate,
      paymentLink: mpPreferenceId,
      isActive: updates.isActive || room.dataValues.isActive,
    });

    return room.dataValues;
  } catch (error: any) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError(
      `No fue posible actualizar la sala: ${error.message}`,
    );
  }
};
