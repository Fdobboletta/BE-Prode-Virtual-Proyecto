import { dbModels } from '../../server';
import { Score } from '../../database/models/forecast';
import { UnknownError } from '../../custom-errors';

type ForecastInput = {
  forecastedScore: Score;
  matchId: string;
};

export const getForecast = async ({
  matchId,
  userId,
}: {
  matchId: string;
  userId: string;
}): Promise<Score | null> => {
  const existingForecast = await dbModels.ForecastModel.findOne({
    where: { playerId: userId, matchId: matchId },
  });

  if (!existingForecast) return null;
  else return existingForecast.dataValues.estimatedScore;
};

export const createOrUpdateMultipleForecasts = async ({
  forecasts,
  userId,
}: {
  forecasts: ForecastInput[];
  userId: string;
}): Promise<boolean> => {
  try {
    await Promise.all(
      forecasts.map(async (forecast) => {
        const existingForecast = await dbModels.ForecastModel.findOne({
          where: { playerId: userId, matchId: forecast.matchId },
        });

        if (existingForecast) {
          await existingForecast.update({
            estimatedScore: forecast.forecastedScore,
          });
        } else {
          await dbModels.ForecastModel.create({
            playerId: userId,
            matchId: forecast.matchId,
            estimatedScore: forecast.forecastedScore,
          });
        }
      }),
    );

    return true;
  } catch (error: any) {
    throw new UnknownError(`Error updating forecasts: ${error.message}`);
  }
};
