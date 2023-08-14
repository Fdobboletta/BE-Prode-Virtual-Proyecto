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

  if (!token) {
    return { req, userId: null }; // No hay token, por lo que userId se establece en null
  }

  try {
    const { userId } = decodeUserToken(token.replace('Bearer ', ''));
    return { req, userId };
  } catch (error) {
    return { req, userId: null }; // Si hay un error al decodificar el token, userId se establece en null
  }
};
