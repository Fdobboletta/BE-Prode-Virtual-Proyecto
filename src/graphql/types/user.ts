import {
  booleanArg,
  enumType,
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import * as service from '../services/user';
import { UserRole } from '../../database/models/user';

export const UserRoleEnum = enumType({
  name: 'UserRole',
  members: UserRole,
});

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
      t.nonNull.field('role', { type: nonNull(UserRoleEnum) });
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
    termsAccepted: nonNull(booleanArg()),
    role: nonNull(UserRoleEnum),
  },
  resolve: async (_, args) => {
    const response = await service.registerNewUser({
      ...args,
      role: args.role as UserRole, // TS error but this is reliable
    });

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

export const sendResetPasswordEmail = mutationField('sendResetPasswordEmail', {
  type: nullable('String'),
  args: {
    email: nonNull(stringArg()),
  },
  resolve: async (_, args) => {
    await service.resetPassword({ email: args.email });
    return null;
  },
});

export const changePassword = mutationField('changePassword', {
  type: nullable('String'),
  args: {
    newPassword: nonNull(stringArg()),
    token: nonNull(stringArg()),
  },
  resolve: async (_, args) => {
    await service.changePassword(args.newPassword, args.token);
    return null;
  },
});

export const getUserMpAccessToken = queryField('getUserMpAccessToken', {
  type: nullable('String'),
  resolve: async (_, args, ctx) => {
    return service.getUserMpAccessToken(ctx.userId || '');
  },
});
