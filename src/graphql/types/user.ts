import { mutationField, nonNull, objectType, stringArg } from 'nexus';
import * as service from '../services/user';

export const UserObject = objectType({
  name: 'User',
  description: 'App user',
  definition: (t) => {
    t.nonNull.id('id'),
      t.nonNull.string('email'),
      t.nonNull.string('firstName'),
      t.nonNull.string('lastName'),
      t.nonNull.string('address'),
      t.nonNull.string('cellphone'),
      t.nonNull.string('token'),
      t.nonNull.string('role');
  },
});

export const registerNewUser = mutationField('registerNewUser', {
  type: nonNull(UserObject),
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
    firstName: nonNull(stringArg()),
    lastName: nonNull(stringArg()),
    address: nonNull(stringArg()),
    cellphone: nonNull(stringArg()),
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
