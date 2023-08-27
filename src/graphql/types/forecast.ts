import { inputObjectType, list, mutationField, nonNull } from 'nexus';

import { checkAuthAndRole } from './utils';
import { UserRole } from '../../database/models/user';

import * as services from '../services/forecasts';
import { ScoreEnum } from './match';

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
      const booleanResult = await services.createOrUpdateMultipleForecasts({
        userId: ctx.userId || '',
        forecasts: args.forecasts,
      });

      return booleanResult;
    },
  },
);
