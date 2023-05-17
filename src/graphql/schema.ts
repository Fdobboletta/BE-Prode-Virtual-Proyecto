import { DIRECTORIES } from '../config';
import { makeSchema, nonNull, queryField } from 'nexus';
import path from 'path';
import * as typeDefs from './types';

export const schema = makeSchema({
  types: typeDefs,
  contextType: {
    module: require.resolve('./context'),
    export: 'GqlContext',
  },

  outputs: {
    schema: path.join(DIRECTORIES.gqlGenerated, 'schema.gen.graphql'),
    typegen: path.join(DIRECTORIES.gqlGenerated, 'types.gen.ts'),
  },
});
