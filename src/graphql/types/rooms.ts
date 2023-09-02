import { formatISO } from 'date-fns';
import {
  booleanArg,
  floatArg,
  list,
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { UserInputError } from 'apollo-server-express';

import { UserRole } from '../../database/models/user';
import * as services from '../services/rooms';
import * as participantServices from '../services/participant';
import * as userServices from '../services/user';

import { UserObject } from './user';
import { checkAuthAndRole } from './utils';

export const RoomObject = objectType({
  name: 'Room',
  description: 'Sala de prode',
  definition: (t) => {
    t.nonNull.id('id'),
      t.nonNull.id('creatorId'),
      t.nonNull.string('name'),
      t.nonNull.string('dueDate'),
      t.nonNull.float('prizeMoney'),
      t.nonNull.float('entryPrice'),
      t.nonNull.string('paymentLink'),
      t.nonNull.boolean('isActive');
    t.field('creator', {
      type: nonNull(UserObject),
      resolve: async (room, _, ctx) => {
        const creatorUser = await userServices.getUserById(room.creatorId);
        return { ...creatorUser, token: '' };
      },
    });
    t.field('participantsCount', {
      type: nonNull('Int'),
      resolve: async (room, _, ctx) => {
        // Fetch and return forecasts for this match and the requesting user
        const participantsCount =
          await participantServices.getParticipantsCount(room.id);
        return participantsCount;
      },
    });
  },
});

export const getUserPayedRooms = queryField('getUserPayedRooms', {
  type: nonNull(list(nonNull(RoomObject))),
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.PLAYER);
    const roomsList = await services.getUserPayedRooms(ctx.userId || '');

    return roomsList.map((room) => ({
      ...room,
      dueDate: formatISO(room.dueDate),
    }));
  },
});

export const getRoomsByUserId = queryField('getRoomsByUserId', {
  type: nonNull(list(nonNull(RoomObject))),
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const roomsList = await services.getRoomsByCreatorId(ctx.userId || '');

    return roomsList.map((room) => ({
      ...room,
      dueDate: formatISO(room.dueDate),
    }));
  },
});

export const getActiveUnpaidRooms = queryField('getActiveUnpaidRooms', {
  type: nonNull(list(nonNull(RoomObject))),
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.PLAYER);
    const roomsList = await services.getActiveUnpaidRooms({
      userId: ctx.userId || '',
    });

    return roomsList.map((room) => ({
      ...room,
      dueDate: formatISO(room.dueDate),
    }));
  },
});

export const getRoomById = queryField('getRoomById', {
  type: nonNull(RoomObject),
  args: {
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.userId) {
      throw new UserInputError('Authentication required');
    }
    const room = await services.getRoomById(args.roomId);

    return { ...room, dueDate: formatISO(room.dueDate) };
  },
});

export const createRoom = mutationField('createRoom', {
  type: nonNull(RoomObject),
  args: {
    name: nonNull(stringArg()),
    dueDate: nonNull(stringArg()),
    prizeMoney: nonNull(floatArg()),
    entryPrice: nonNull(floatArg()),
    isActive: nonNull(booleanArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const newRoom = await services.createNewRoom(
      {
        isActive: args.isActive,
        name: args.name,
        dueDate: args.dueDate,
        prizeMoney: args.prizeMoney,
        entryPrice: args.entryPrice,
      },
      ctx.userId || '',
    );
    return { ...newRoom, dueDate: formatISO(newRoom.dueDate) };
  },
});

export const activateRoom = mutationField('activateRoom', {
  type: nonNull(RoomObject),
  args: {
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const updatedRoom = await services.activateRoom(args.roomId);
    return { ...updatedRoom, dueDate: formatISO(updatedRoom.dueDate) };
  },
});

export const updateRoom = mutationField('updateRoom', {
  type: nullable(RoomObject),
  args: {
    roomId: nonNull(stringArg()),
    name: nonNull(stringArg()),
    dueDate: nonNull(stringArg()),
    prizeMoney: nonNull(floatArg()),
    entryPrice: nonNull(floatArg()),
    isActive: nonNull(booleanArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const updatedRoom = await services.updateRoom(
      args.roomId,
      {
        name: args.name,
        dueDate: args.dueDate,
        prizeMoney: args.prizeMoney,
        entryPrice: args.entryPrice,
        isActive: args.isActive,
      },
      ctx.userId || '',
    );
    return { ...updatedRoom, dueDate: formatISO(updatedRoom.dueDate) };
  },
});

export const deleteRoom = mutationField('deleteRoom', {
  type: nullable('String'),
  args: {
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    await services.deleteRoom(args.roomId);
    return null;
  },
});

export const RoomParticipantWithScore = objectType({
  name: 'RoomParticipantWithScore',
  description:
    'Lista de participantes de la sala ordenada por puntaje de forma descendente',
  definition: (t) => {
    t.nonNull.id('participantId'),
      t.nonNull.string('name'),
      t.nonNull.string('lastName'),
      t.nonNull.string('email'),
      t.int('score');
  },
});

export const calculateRoomResults = mutationField('calculateRoomResults', {
  type: nonNull(list(nonNull(RoomParticipantWithScore))),
  args: {
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.ADMIN);
    const ranking = await services.calculateRoomResults(args.roomId);
    return ranking;
  },
});
