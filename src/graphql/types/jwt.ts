import { booleanArg, nonNull, queryField, stringArg } from 'nexus';
import { isJwtValid } from '../services/jwt';

export const validateToken = queryField('validateToken', {
  type: nonNull('Boolean'),
  args: {
    token: nonNull(stringArg()),
    isResetPassword: nonNull(booleanArg()),
  },
  resolve: async (_, args) => isJwtValid(args.token, args.isResetPassword),
});
