import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRole, UserType } from '../../database/models/userModel';
import { dbModels } from '../../server';

type RegisterUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  cellphone: string;
};

// Generate a JWT token
const generateToken = (user: UserType) => {
  const payload = { userId: user.id, email: user.email };
  const options = { expiresIn: '1h' };
  return sign(payload, process.env.JWT_SECRET || '', options);
};

export const registerNewUser = async (
  args: RegisterUserArgs,
): Promise<{ token: string; user: UserType }> => {
  try {
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
      role: UserRole.PLAYER,
    });

    // Generate JWT token
    const token = generateToken(user.dataValues);

    return { token, user: user.dataValues };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('UNKNOWN ERROR');
  }
};

type AuthenticateUserArgs = {
  email: string;
  password: string;
};

export const authenticateUser = async (
  args: AuthenticateUserArgs,
): Promise<{ token: string; user: UserType }> => {
  try {
    // Find user in the database by email
    const user = await dbModels.UserModel.findOne({
      where: { email: args.email },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    // Compare provided password with stored password hash
    const passwordMatch = await bcrypt.compare(
      args.password,
      user.dataValues.password,
    );

    if (!passwordMatch) {
      throw new Error('Invalid password.');
    }

    // Generate JWT token
    const token = generateToken(user.dataValues);

    return { token, user: user.dataValues };
  } catch (err) {
    console.log(err);
    throw new Error('Unable to authenticate user.');
  }
};

type ResetPasswordArgs = {
  email: string;
};

type ResetPasswordTokenPayload = {
  userId: string;
  email: string;
  exp: number;
};

const generateResetPasswordToken = (user: UserType): string => {
  const payload: ResetPasswordTokenPayload = {
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expire in 1 hour
  };
  return sign(payload, process.env.RESET_PASSWORD_SECRET || '');
};

export const resetPassword = async (args: ResetPasswordArgs): Promise<void> => {
  try {
    const user = await dbModels.UserModel.findOne({
      where: { email: args.email },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const resetPasswordToken = generateResetPasswordToken(user.dataValues);

    // TODO: Send email to user with reset password link containing the resetPasswordToken
  } catch (err) {
    console.log(err);
    throw new Error('Unable to reset password.');
  }
};
