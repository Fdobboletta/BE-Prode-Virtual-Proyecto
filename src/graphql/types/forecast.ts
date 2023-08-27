import { inputObjectType, list, mutationField, nonNull } from 'nexus';

import { checkAuthAndRole } from './utils';
import { UserRole } from '../../database/models/user';

import * as services from '../services/forecasts';
import { ScoreEnum } from './match';
import { Score } from '../../database/models/match';

export const ForecastInput = inputObjectType({
  name: 'ForecastInput',
  definition: (t) => {
    t.nonNull.id('matchId');
    t.field('score', { type: ScoreEnum });
  },
});

export const createOrUpdateMultipleForecasts = mutationField(
  'createOrUpdateMultipleForecasts',
  {
    type: nonNull('Boolean'),
    args: {
      forecasts: nonNull(list(nonNull(ForecastInput))),
    },
    resolve: async (_, args, ctx) => {
      checkAuthAndRole(ctx, UserRole.PLAYER);

      const forecasts = args.forecasts.map(
        (forecast: {
          matchId: string;
          score?: 'away' | 'draw' | 'home' | null | undefined;
        }) => ({
          matchId: forecast.matchId,
          forecastedScore: forecast.score as Score | null | undefined,
        }),
      );
      const booleanResult = await services.createOrUpdateMultipleForecasts({
        userId: ctx.userId || '',
        forecasts: forecasts,
      });

      return booleanResult;
    },
  },
);
