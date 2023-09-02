import bcrypt from 'bcrypt';
import { UserRole, UserType } from '../../database/models/user';
import { dbModels } from '../../server';
import {
  AuthenticationError,
  BadRequestError,
  CustomError,
  DuplicateEmailError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from '../../custom-errors';
import { sendResetPasswordEmail } from './nodemailer';
import {
  decodeResetPasswordToken,
  generateRegisterToken,
  generateResetPasswordToken,
} from './jwt';

type RegisterUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  cellphone: string;
  termsAccepted: boolean;
  role: UserRole;
};

type AuthenticateUserArgs = {
  email: string;
  password: string;
};

type ResetPasswordArgs = {
  email: string;
};

export const registerNewUser = async (
  args: RegisterUserArgs,
): Promise<{ token: string; user: UserType }> => {
  try {
    // Validate input
    if (
      !args.email ||
      !args.password ||
      !args.firstName ||
      !args.lastName ||
      !args.address ||
      !args.cellphone
    ) {
      throw new BadRequestError('All fields are required.');
    }

    // Check if user already exists
    const existingUser = await dbModels.UserModel.findOne({
      where: { email: args.email },
    });

    if (existingUser) {
      throw new DuplicateEmailError();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(args.password, 10);

    // Create new user in the database
    const user = await dbModels.UserModel.create({
      email: args.email,
      password: hashedPassword,
      firstName: args.firstName,
      lastName: args.lastName,
      address: args.address,
      cellphone: args.cellphone,
      role: args.role || UserRole.PLAYER,
      termsAccepted: args.termsAccepted || false,
    });

    // Generate JWT token
    const token = generateRegisterToken(user.dataValues);

    return { token, user: user.dataValues };
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError();
  }
};

export const authenticateUser = async (
  args: AuthenticateUserArgs,
): Promise<{ token: string; user: UserType }> => {
  try {
    const user = await dbModels.UserModel.findOne({
      where: { email: args.email },
    });

    if (!user) {
      throw new NotFoundError('Email o contraseña incorrectos');
    }

    const passwordMatch = await bcrypt.compare(
      args.password,
      user.dataValues.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError('Email o contraseña incorrectos');
    }

    const token = generateRegisterToken(user.dataValues);

    return { token, user: user.dataValues };
  } catch (err) {
    console.error(err);

    throw new AuthenticationError('Email o contraseña incorrectos');
  }
};

export const resetPassword = async (args: ResetPasswordArgs): Promise<void> => {
  try {
    const user = await dbModels.UserModel.findOne({
      where: { email: args.email },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const resetPasswordToken = generateResetPasswordToken(user.dataValues);

    await sendResetPasswordEmail(user.dataValues.email, resetPasswordToken);
  } catch (err) {
    console.log(err);
    throw new UnknownError(
      'El email ingresado no corresponde a un usuario registrado',
    );
  }
};

export const changePassword = async (
  newPassword: string,
  resetPasswordToken: string,
): Promise<void> => {
  try {
    // Verify the reset password token and extract the user ID and email
    const decodedToken = decodeResetPasswordToken(resetPasswordToken);

    if (!decodedToken) {
      throw new UnauthorizedError('Invalid reset password token.');
    }

    const { userId } = decodedToken;

    // Fetch the user from the database
    const user = await dbModels.UserModel.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await user.update({ password: hashedPassword });
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error('Unable to change password.');
  }
};

export const getUserMpAccessToken = async (userId: string) => {
  try {
    if (!userId) return null;

    const user = await dbModels.UserModel.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.dataValues.mercadoPagoAccessToken;
  } catch (error) {
    console.error('Error getting user Mp access token:', error);
    throw new Error('Unable get user MP access token.');
  }
};

export const getUserById = async (userId: string): Promise<UserType> => {
  try {
    const user = await dbModels.UserModel.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.dataValues;
  } catch (error) {
    console.error('Error getting user Mp access token:', error);
    throw new Error('Unable get user MP access token.');
  }
};

export const updateUserData = async (
  userId: string,
  args: {
    newPassword?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    cellphone?: string | null | undefined;
    address?: string | null | undefined;
  },
) => {
  try {
    // Encuentra al usuario actual en la base de datos
    const user = await dbModels.UserModel.findByPk(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    if (args.newPassword) {
      const hashedPassword = await bcrypt.hash(args.newPassword, 10);
      user.dataValues.password = hashedPassword;
    }

    if (args.firstName) {
      user.dataValues.firstName = args.firstName;
    }

    if (args.lastName) {
      user.dataValues.lastName = args.lastName;
    }

    if (args.cellphone) {
      user.dataValues.cellphone = args.cellphone;
    }

    if (args.address) {
      user.dataValues.address = args.address;
    }

    // Guarda los cambios en la base de datos
    await user.save();

    // Devuelve el usuario actualizado
    return user;
  } catch (error) {
    console.error(error);

    // Maneja los errores específicos según tus necesidades
    if (error instanceof CustomError) {
      throw error;
    }
    throw new UnknownError('Error desconocido al actualizar el usuario');
  }
};
