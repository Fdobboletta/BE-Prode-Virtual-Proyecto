import { MatchType } from '../../database/models/match';
import {
  BadRequestError,
  CustomError,
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

    // Create new room in the database
    const match = await dbModels.MatchModel.create({
      homeTeam: args.homeTeam,
      awayTeam: args.awayTeam,
      startDate: new Date(args.startDate),
      roomId: args.roomId,
    });
    return match.dataValues;
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError();
  }
};
