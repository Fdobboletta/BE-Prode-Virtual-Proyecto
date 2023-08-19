import { formatISO } from 'date-fns';
import * as services from '../services/rooms';
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
import { checkAuthAndRole } from './utils';

export const RoomObject = objectType({
  name: 'Room',
  description: 'Sala de prode',
  definition: (t) => {
    t.nonNull.id('id'),
      t.nonNull.string('name'),
      t.nonNull.string('dueDate'),
      t.nonNull.float('prizeMoney'),
      t.nonNull.float('entryPrice'),
      t.nonNull.string('paymentLink'),
      t.nonNull.boolean('isActive');
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

export const getActiveRooms = queryField('getActiveRooms', {
  type: nonNull(list(nonNull(RoomObject))),
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.PLAYER);
    const roomsList = await services.getActiveRooms();

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
