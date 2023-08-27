import { enumType, inputObjectType, list, mutationField, nonNull } from 'nexus';

import { Score } from '../../database/models/forecast';
import { checkAuthAndRole } from './utils';
import { UserRole } from 'database/models/user';

import * as services from '../services/forecasts';

export const ScoreEnum = enumType({
  name: 'Score',
  members: Score,
});

export const ForecastInput = inputObjectType({
  name: 'ScoreUpdateInput',
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
      const booleanResult = await services.createOrUpdateMultipleForecasts({
        userId: ctx.userId || '',
        forecasts: args.forecasts,
      });

      return booleanResult;
    },
  },
);
