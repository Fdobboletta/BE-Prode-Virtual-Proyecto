import { formatISO } from 'date-fns';
import * as services from '../services/rooms';
import {
  booleanArg,
  floatArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';

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
    const roomsList = await services.getRoomsByCreatorId(ctx.userId || '');

    return roomsList.map((room) => ({
      ...room,
      dueDate: formatISO(room.dueDate),
    }));
  },
});
