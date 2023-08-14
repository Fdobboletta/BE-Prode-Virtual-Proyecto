import { IncomingHttpHeaders } from 'http';
import { decodeUserToken } from './services/jwt';

export interface Context {
  req: {
    headers: IncomingHttpHeaders;
  };
  userId: string | null;
}

export const createContext = ({ req }: { req: any }): Context => {
  const token = req.headers.authorization;

  const { userId } = decodeUserToken(token.replace('Bearer ', ''));

  return { req, userId };
};
