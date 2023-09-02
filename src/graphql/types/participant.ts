import { list, nonNull, objectType, queryField, stringArg } from 'nexus';

import { UserRole } from '../../database/models/user';
import { checkAuthAndRole } from './utils';
import * as services from '../services/participant';

export const ParticipantObject = objectType({
  name: 'Participant',
  description: 'Usuario participando de un prode',
  definition: (t) => {
    t.nonNull.id('id'),
      t.nonNull.string('email'),
      t.nonNull.string('firstName'),
      t.nonNull.string('lastName'),
      t.int('score');
  },
});

export const getParticipantsByRoomId = queryField('getParticipantsByRoomId', {
  type: nonNull(list(nonNull(ParticipantObject))),
  args: {
    roomId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    checkAuthAndRole(ctx, UserRole.PLAYER);
    const participantList = await services.getParticipantsByRoomId(args.roomId);

    return participantList;
  },
});
