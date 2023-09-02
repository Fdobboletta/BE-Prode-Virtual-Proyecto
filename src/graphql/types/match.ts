import {
  enumType,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { Score } from '../../database/models/match';
import * as forecastServices from '../services/forecasts';
import * as services from '../services/match';
import { formatISO } from 'date-fns';
import { UserRole } from '../../database/models/user';
import { checkAuthAndRole } from './utils';

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
      t.nullable.field('officialScore', { type: ScoreEnum }),
      t.nonNull.string('startDate'),
      t.nonNull.id('roomId');
    t.field('userForecast', {
      type: ScoreEnum,
      resolve: async (parent, _, ctx) => {
        // Fetch and return forecasts for this match and the requesting user
        const forecast = (await forecastServices.getForecast({
          matchId: parent.id,
          userId: ctx.userId || '',
        })) as Score | null;

        return forecast;
      },
    });
  },
});

export const ScoreUpdateInput = inputObjectType({
  name: 'ScoreUpdateInput',
  definition: (t) => {
    t.nonNull.id('matchId');
    t.field('score', { type: ScoreEnum });
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
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const newMatch = await services.createMatch({
      homeTeam: args.homeTeam,
      awayTeam: args.awayTeam,
      startDate: args.date,
      roomId: args.roomId,
    });

    return { ...newMatch, startDate: formatISO(newMatch.startDate) };
  },
});

export const updateMatch = mutationField('updateMatch', {
  type: nonNull(MatchObject),
  args: {
    matchId: nonNull(stringArg()),
    homeTeam: nonNull(stringArg()),
    awayTeam: nonNull(stringArg()),
    date: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const updatedMatch = await services.updateMatch(args.matchId, {
      homeTeam: args.homeTeam,
      startDate: args.date,
      awayTeam: args.awayTeam,
    });

    return { ...updatedMatch, startDate: formatISO(updatedMatch.startDate) };
  },
});

export const deleteMatch = mutationField('deleteMatch', {
  type: nullable('String'),
  args: {
    matchId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    await services.deleteMatch(args.matchId);
    return null;
  },
});

export const getMatchesByRoomId = queryField('getMatchesByRoomId', {
  type: nonNull(list(nonNull(MatchObject))),
  args: {
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const roomsList = await services.getMatchesByRoomId(args.roomId);

    return roomsList.map((room) => ({
      ...room,
      startDate: formatISO(room.startDate),
    }));
  },
});

export const getMatchesByRoomIdForPlayers = queryField(
  'getMatchesByRoomIdForPlayers',
  {
    type: nonNull(list(nonNull(MatchObject))),
    args: {
      roomId: nonNull(stringArg()),
    },
    resolve: async (_, args, ctx) => {
      checkAuthAndRole(ctx, UserRole.PLAYER);
      const roomsList = await services.getMatchesByRoomIdPlayer(
        args.roomId,
        ctx.userId || '',
      );

      return roomsList.map((room) => ({
        ...room,
        startDate: formatISO(room.startDate),
      }));
    },
  },
);

export const updateManyMatchScores = mutationField('updateManyMatchScores', {
  type: nonNull(list(nonNull(MatchObject))),
  args: {
    scoreUpdates: nonNull(list(nonNull(ScoreUpdateInput))),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const scoreUpdates = args.scoreUpdates.map(
      (scoreUpdate: {
        matchId: string;
        score?: 'away' | 'draw' | 'home' | null | undefined;
      }) => ({
        ...scoreUpdate,
        score: scoreUpdate.score as Score | null | undefined,
      }),
    );

    const updatedMatches = await services.updateManyMatchScores(scoreUpdates);

    return updatedMatches.map((match) => ({
      ...match,
      startDate: formatISO(match.startDate),
    }));
  },
});
