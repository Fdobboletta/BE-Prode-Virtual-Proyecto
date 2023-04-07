import {
  enumType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { createPosition, getAllPositions } from '../services/position';

const PositionZone = enumType({
  name: 'PositionZone',
  members: ['ARQ', 'DEF', 'MED', 'DEL'],
});

export const PositionObject = objectType({
  name: 'User',
  description: 'App user',
  definition: (t) => {
    t.nonNull.id('id');
    t.nonNull.string('name'),
      t.nonNull.string('abbreviation'),
      t.field('zone', { type: PositionZone });
  },
});

export const createPositionMutation = mutationField('createPosition', {
  type: nonNull(PositionObject),
  args: {
    name: nonNull(stringArg()),
    abbreviation: nonNull(stringArg()),
    zone: nonNull(PositionZone),
  },
  resolve: async (_, { name, abbreviation, zone }) => {
    const newPosition = await createPosition({ name, abbreviation, zone });
    return newPosition;
  },
});

export const getAllPositionsQuery = queryField('getAllPositions', {
  type: nonNull(list(nonNull(PositionObject))),
  resolve: async () => {
    const positions = await getAllPositions();
    return positions;
  },
});
