import { UserInputError } from 'apollo-server-express';
import { UserRole } from '../../database/models/user';
import { Context } from 'graphql/context';

export const checkAuthAndRole = (ctx: Context, requiredRole: UserRole) => {
  if (!ctx.userId) {
    throw new UserInputError('Authentication required');
  }
  if (requiredRole === UserRole.ADMIN && ctx.role === UserRole.PLAYER) {
    throw new UserInputError('Authentication required');
  }
};
