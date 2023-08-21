import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { UserRole, UserType } from '../../database/models/user';

type ResetPasswordTokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
};

type TokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
};

const TOKEN_EXPIRATION_SECONDS = 60 * 60; // 60 minutos

// Generate a JWT token (register)
export const generateRegisterToken = (
  user: Pick<UserType, 'id' | 'email' | 'role'>,
): string => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS,
  };
  return sign(payload, process.env.JWT_SECRET || '');
};

// Generate a JWT token (resetPassword)
export const generateResetPasswordToken = (
  user: Pick<UserType, 'id' | 'email' | 'role'>,
): string => {
  const payload: ResetPasswordTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS,
  };
  return sign(payload, process.env.RESET_PASSWORD_SECRET || '');
};

export const decodeResetPasswordToken = (
  token: string,
): {
  userId: string;
  email: string;
  role: UserRole;
} => {
  return verify(token, process.env.RESET_PASSWORD_SECRET || '') as {
    userId: string;
    email: string;
    role: UserRole;
  };
};

export const decodeUserToken = (
  token: string,
): {
  userId: string;
  email: string;
  role: UserRole;
} => {
  try {
    const { userId, email, role } = verify(
      token,
      process.env.JWT_SECRET || '',
    ) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    return { userId, email, role };
  } catch (error) {
    throw new Error('Invalid token ');
  }
};

export const isJwtValid = (token: string, isResetPassword: boolean) => {
  try {
    verify(
      token,
      isResetPassword
        ? process.env.RESET_PASSWORD_SECRET || ''
        : process.env.JWT_SECRET || '',
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const refreshTokenIfAboutToExpire = (token: string): string => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || '') as TokenPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = decoded.exp - currentTime;

    const REFRESH_THRESHOLD = 300; // 5 minutes

    if (timeUntilExpiration <= REFRESH_THRESHOLD) {
      const user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      return generateRegisterToken(user);
    }

    return token;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
