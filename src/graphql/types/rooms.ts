import { createNewRoom } from '../services/rooms';
import {
  booleanArg,
  floatArg,
  mutationField,
  nonNull,
  objectType,
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
    const newRoom = await createNewRoom(
      {
        isActive: args.isActive,
        name: args.name,
        dueDate: args.dueDate,
        prizeMoney: args.prizeMoney,
        entryPrice: args.entryPrice,
      },
      ctx.userId || '',
    );
    return newRoom;
  },
});
