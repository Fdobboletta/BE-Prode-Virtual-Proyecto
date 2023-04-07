import { mutationField, nonNull, objectType, stringArg } from 'nexus';
import * as service from '../services/user';

export const UserObject = objectType({
  name: 'User',
  description: 'App user',
  definition: (t) => {
    t.nonNull.id('id');
    t.string('teamId');
    t.nonNull.string('firstName'),
      t.nonNull.string('lastName'),
      t.nonNull.string('email'),
      t.nonNull.string('token');
  },
});

export const registerNewUser = mutationField('registerNewUser', {
  type: nonNull(UserObject),
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
    firstName: nonNull(stringArg()),
    lastName: nonNull(stringArg()),
    teamId: stringArg(),
  },
  resolve: async (_, args) => {
    const response = await service.registerNewUser(args);

    return { ...response.user, token: response.token };
  },
});

export const authenticateUser = mutationField('authenticateUser', {
  type: nonNull(UserObject),
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_, args) => {
    const response = await service.authenticateUser(args);

    return { ...response.user, token: response.token };
  },
});
