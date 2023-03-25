import { sequelizeInstance } from '../database/index';
import _ from 'lodash/fp';

export type GqlContext = Readonly<{
  user: {} | undefined;
  sequelizeInstance: typeof sequelizeInstance;
}>;

// export const extractHttpAuth = (input: HttpContext): string | undefined =>
//   _.get(['ctx', 'request', 'header', 'authorization'], input) ||
//   _.get(['ctx', 'request', 'header', 'Authorization'], input);

export const createGQLContext = async (
  authorization: string | undefined,
): Promise<GqlContext> => {
  if (!authorization) {
    return {
      user: undefined,
      sequelizeInstance,
    };
  }

  try {
    const user = {};

    return {
      user,
      sequelizeInstance,
    };
  } catch {
    return {
      user: undefined,
      sequelizeInstance,
    };
  }
};
