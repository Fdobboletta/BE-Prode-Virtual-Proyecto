import { mutationField, nonNull, objectType, stringArg } from 'nexus';
import * as service from '../services/team';

export const TeamObject = objectType({
  name: 'Team',
  description: 'Soccer Team',
  definition: (t) => {
    t.nonNull.id('id');
    t.nonNull.string('name'),
      t.nonNull.string('logoUrl'),
      t.nonNull.string('mainColor'),
      t.string('secondColor');
    t.string('thirdColor');
    t.nonNull.string('city');
    t.string('description');
  },
});

export const createTeam = mutationField('createTeam', {
  type: nonNull(TeamObject),
  args: {
    name: nonNull(stringArg()),
    logoUrl: nonNull(stringArg()),
    mainColor: nonNull(stringArg()),
    secondColor: stringArg(),
    thirdColor: stringArg(),
    city: nonNull(stringArg()),
    description: stringArg(),
  },
  resolve: async (_, args) => {
    const newTeam = await service.createTeam(args);
    return newTeam;
  },
});
