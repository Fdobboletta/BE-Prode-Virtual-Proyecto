import { enumType, mutationField, nonNull, objectType, stringArg } from 'nexus';
import { Score } from '../../database/models/match';
import { UserInputError } from 'apollo-server-express';
import * as services from '../services/match';
import { formatISO } from 'date-fns';

export const ScoreEnum = enumType({
  name: 'Score',
  members: Score,
});

export const MatchObject = objectType({
  name: 'Match',
  description: 'Partido',
  definition: (t) => {
    t.nonNull.id('id'),
      t.nonNull.string('homeTeam'),
      t.nonNull.string('awayTeam'),
      t.nonNull.field('officialScore', { type: ScoreEnum }),
      t.nonNull.string('startDate'),
      t.nonNull.id('roomId');
  },
});

export const createMatch = mutationField('createMatch', {
  type: nonNull(MatchObject),
  args: {
    homeTeam: nonNull(stringArg()),
    awayTeam: nonNull(stringArg()),
    date: nonNull(stringArg()),
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.userId) {
      throw new UserInputError('Authentication required');
    }

    const newMatch = await services.createMatch({
      homeTeam: args.homeTeam,
      awayTeam: args.awayTeam,
      startDate: args.date,
      roomId: args.roomId,
    });

    return { ...newMatch, startDate: formatISO(newMatch.startDate) };
  },
});
