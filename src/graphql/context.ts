import { IncomingHttpHeaders } from 'http';
import { decodeUserToken } from './services/jwt';
import { UserRole } from '../database/models/user';

export interface Context {
  req: {
    headers: IncomingHttpHeaders;
  };
  userId: string | null;
  role: UserRole | null;
}

export const createContext = ({ req }: { req: any }): Context => {
  const token = req.headers.authorization;

  if (!token) {
    return { req, userId: null, role: null }; // No hay token, por lo que userId se establece en null
  }

  try {
    const { userId, role } = decodeUserToken(token.replace('Bearer ', ''));
    return { req, userId, role };
  } catch (error) {
    return { req, userId: null, role: null }; // Si hay un error al decodificar el token, userId se establece en null
  }
};
