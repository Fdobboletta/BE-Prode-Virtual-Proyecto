import path from 'path';

const SERVER_ROOT = path.dirname(__dirname);

export const DIRECTORIES = {
  gqlGenerated: path.join(SERVER_ROOT, 'src/graphql/generated'),
};

export const buildMercadoPagoHeaders = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};
