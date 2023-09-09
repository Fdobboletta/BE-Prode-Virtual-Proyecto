import { RoomCreationType, RoomType } from '../../database/models/room';
import {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnknownError,
} from '../../custom-errors';
import { dbModels } from '../../server';
import { ParticipantType } from '../../database/models/participant';

import { Model, Op } from 'sequelize';

import { ForecastType } from '../../database/models/forecast';
import { MatchCreationType, MatchType } from 'database/models/match';
import { UserCreationType, UserType } from 'database/models/user';

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

    // Create new room in the database
    const room = await dbModels.RoomModel.create({
      name: args.name,
      entryPrice: args.entryPrice,
      prizeMoney: args.prizeMoney,
      dueDate: new Date(args.dueDate),
      paymentLink: '',
      isActive: args.isActive || false,
      creatorId: userId,
      isClosed: false,
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

export const getActiveUnpaidRooms = async ({
  userId,
}: {
  userId: string;
}): Promise<RoomType[]> => {
  try {
    const currentUserPaidRooms = await dbModels.ParticipantModel.findAll({
      where: { playerId: userId, paymentStatus: 'approved' },
      attributes: ['roomId'],
    });

    const paidRoomIds = currentUserPaidRooms.map(
      (roomFromQuery) => roomFromQuery.dataValues.roomId,
    );

    const activeUnpaidRooms = await dbModels.RoomModel.findAll({
      where: {
        id: { [Op.notIn]: paidRoomIds },
        isActive: true,
        isClosed: false,
      },
    });

    return activeUnpaidRooms.map((room) => room.dataValues);
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

type ParticipantWithRoom = ParticipantType & {
  room: Model<RoomType, RoomCreationType>;
};

export const getUserPayedRooms = async (
  userId: string,
): Promise<RoomType[]> => {
  try {
    const participant = (
      await dbModels.ParticipantModel.findAll({
        where: { playerId: userId },
        include: { model: dbModels.RoomModel, as: 'room' },
      })
    ).map((payment) => payment.dataValues);

    if (!participant) {
      throw new NotFoundError(
        'No se pudo encontrar el pago con el ID solicitado',
      );
    }

    return participant.map((participant) => {
      const paymentWithRoom = participant as ParticipantWithRoom;

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

    await room.update({
      name: updates.name || room.dataValues.name,
      entryPrice: updates.entryPrice || room.dataValues.entryPrice,
      prizeMoney: updates.prizeMoney || room.dataValues.prizeMoney,
      dueDate: updates.dueDate
        ? new Date(updates.dueDate)
        : room.dataValues.dueDate,
      paymentLink: room.dataValues.paymentLink,
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

type ForecastWithMatch = ForecastType & {
  match: Model<MatchType, MatchCreationType>;
};

type ParticipantWithUser = ParticipantType & {
  user: Model<UserType, UserCreationType>;
};

const calculateScores = (forecasts: ForecastWithMatch[]) => {
  const playerScores: Record<string, number> = {};

  forecasts.forEach((forecast) => {
    const { officialScore } = forecast.match.dataValues; // Resultado oficial del partido
    const estimatedScore = forecast.estimatedScore; // Pronóstico del jugador

    const score = officialScore === estimatedScore ? 1 : 0;

    if (!playerScores[forecast.playerId]) {
      playerScores[forecast.playerId] = 0;
    }

    playerScores[forecast.playerId] += score;
  });

  return playerScores;
};

export const calculateRoomResults = async (
  roomId: string,
): Promise<
  {
    participantId: string;
    name: string;
    lastName: string;
    email: string;
    score: number | undefined;
  }[]
> => {
  // Obtén todos los partidos (matches) para el Room
  const matches = await dbModels.MatchModel.findAll({
    where: { roomId },
    attributes: ['id'],
  });

  // Luego, utiliza los IDs de los partidos para obtener las predicciones (forecasts)
  const forecastsQuery = await dbModels.ForecastModel.findAll({
    where: {
      matchId: matches.map((match) => match.dataValues.id),
    },
    include: [
      {
        model: dbModels.MatchModel,
        attributes: ['officialScore'],
        as: 'match',
      },
    ],
  });

  const forecasts = forecastsQuery.map(
    (forecast) => forecast.dataValues as ForecastWithMatch,
  );

  // Calcula los puntajes
  const updatedScores = calculateScores(forecasts);

  // Obtiene todos los registros de los participantes para el Room
  const participants = await dbModels.ParticipantModel.findAll({
    where: { roomId },
    attributes: ['id', 'playerId', 'score'],
    include: [
      {
        model: dbModels.UserModel,
        attributes: ['firstName', 'lastName', 'email'],
        as: 'user',
      },
    ],
  });

  const promises = participants.map(async (participant) => {
    const updatedScore = updatedScores[participant.dataValues.playerId] || 0;
    const currentScore = participant.dataValues.score || 0;

    await participant.update({
      score: currentScore + updatedScore,
    });
  });

  await Promise.all(promises);
  const roomToClose = await dbModels.RoomModel.findByPk(roomId);

  if (!roomToClose) {
    throw new NotFoundError(`No se pudo encontrar la sala`);
  }

  await roomToClose.update({ isClosed: true });

  // Ordena los participantes por puntaje en forma descendente
  const sortedParticipants = participants
    .filter((participant) => participant.dataValues.score !== undefined)
    .sort((a, b) => {
      const scoreA = a.dataValues.score || 0;
      const scoreB = b.dataValues.score || 0;
      return scoreB - scoreA;
    })
    .map((participant) => participant.dataValues as ParticipantWithUser);

  // Devuelve la lista de participantes ordenada
  return sortedParticipants.map((participant) => ({
    participantId: participant.id,
    name: participant.user.dataValues.firstName,
    lastName: participant.user.dataValues.lastName,
    email: participant.user.dataValues.email,
    score: participant.score,
  }));
};
