import { MatchType, Score } from '../../database/models/match';
import {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnknownError,
} from '../../custom-errors';
import { dbModels } from '../../server';

type CreateMatchArgs = {
  homeTeam: string;
  awayTeam: string;
  startDate: string;
  roomId: string;
};

export const createMatch = async (
  args: CreateMatchArgs,
): Promise<MatchType> => {
  try {
    if (!args.homeTeam || !args.awayTeam || !args.startDate || !args.roomId) {
      throw new BadRequestError('Todos los campos son requeridos.');
    }

    const match = await dbModels.MatchModel.create({
      homeTeam: args.homeTeam,
      awayTeam: args.awayTeam,
      startDate: new Date(args.startDate),
      roomId: args.roomId,
    });
    return match.dataValues;
  } catch (error: any) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError(`No se pudo crear su partido: ${error.message}`);
  }
};

export const updateMatch = async (
  matchId: string,
  updates: Partial<CreateMatchArgs>,
): Promise<MatchType> => {
  try {
    const match = await dbModels.MatchModel.findByPk(matchId);
    if (!match) {
      throw new NotFoundError('Partido no encontrado o inexistente.');
    }

    await match.update({
      homeTeam: updates.homeTeam || match.dataValues.homeTeam,
      awayTeam: updates.awayTeam || match.dataValues.awayTeam,
      startDate: updates.startDate
        ? new Date(updates.startDate)
        : match.dataValues.startDate,
    });

    return match.dataValues;
  } catch (error: any) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError(
      `No fue posible actualizar el spartido: ${error.message}`,
    );
  }
};

export const updateManyMatchScores = async (
  scoreUpdates: {
    matchId: string;
    score?: Score | null | undefined;
  }[],
): Promise<MatchType[]> => {
  try {
    const updatedMatches: MatchType[] = [];

    for (const { matchId, score } of scoreUpdates) {
      const match = await dbModels.MatchModel.findByPk(matchId);
      if (!match) {
        throw new NotFoundError(`Partido con ID ${matchId} no encontrado.`);
      }

      if (score !== undefined) {
        await match.update({
          officialScore: score,
        });
        updatedMatches.push(match.dataValues);
      }
    }

    return updatedMatches;
  } catch (error: any) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError(
      `No fue posible actualizar los partidos: ${error.message}`,
    );
  }
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  try {
    const match = await dbModels.MatchModel.findByPk(matchId);
    if (!match) {
      throw new NotFoundError('Partido no encontrada o inexistente.');
    }
    await match.destroy();
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(
      `No fue posible eliminar el Partido: ${error.message}`,
    );
  }
};

export const getMatchesByRoomId = async (
  roomId: string,
): Promise<MatchType[]> => {
  try {
    const matches = await dbModels.MatchModel.findAll({
      where: {
        roomId,
      },
    });

    return matches.map((match) => match.dataValues);
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(
      `No se pudieron obtener los Partidos  de la Sala: ${error.message}`,
    );
  }
};

export const getMatchesByRoomIdPlayer = async (
  roomId: string,
  userId: string,
): Promise<MatchType[]> => {
  try {
    const payment = await dbModels.PaymentModel.findOne({
      where: { roomId: roomId, playerId: userId },
    });

    if (!payment) {
      throw new UnknownError(
        `El usuario no ha realizado el pago correspondiente para acceder a esta Sala`,
      );
    }
    const matches = await dbModels.MatchModel.findAll({
      where: {
        roomId,
      },
    });

    return matches.map((match) => match.dataValues);
  } catch (error: any) {
    console.error(error);
    throw new UnknownError(
      `No se pudieron obtener los Partidos  de la Sala: ${error.message}`,
    );
  }
};
