import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { UserType } from '../../database/models/user';

type ResetPasswordTokenPayload = {
  userId: string;
  email: string;
  exp: number;
};

// Generate a JWT token (register)
export const generateRegisterToken = (user: UserType): string => {
  const payload = { userId: user.id, email: user.email };
  const options = { expiresIn: '1h' };
  return sign(payload, process.env.JWT_SECRET || '', options);
};

// Generate a JWT token (resetPassword)
export const generateResetPasswordToken = (user: UserType): string => {
  const payload: ResetPasswordTokenPayload = {
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira en 1 hora
  };
  return sign(payload, process.env.RESET_PASSWORD_SECRET || '');
};

export const decodeResetPasswordToken = (
  token: string,
): {
  userId: string;
  email: string;
} => {
  return verify(token, process.env.RESET_PASSWORD_SECRET || '') as {
    userId: string;
    email: string;
  };
};

export const decodeUserToken = (
  token: string,
): {
  userId: string;
  email: string;
} => {
  try {
    const { userId, email } = verify(token, process.env.JWT_SECRET || '') as {
      userId: string;
      email: string;
    };

    return { userId, email };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid token: ' + error.message);
    }
    throw error;
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
