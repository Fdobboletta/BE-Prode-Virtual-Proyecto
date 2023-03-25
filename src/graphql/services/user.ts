import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel, UserType } from '../../database/models';

type RegisterUserArgs = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

// Generate a JWT token
const generateToken = (user: UserType) => {
  const payload = { userId: user.id, email: user.email };
  const options = { expiresIn: '1h' };
  return sign(payload, process.env.JWT_SECRET || '', options);
};

// Verify a JWT token and return the user ID
const verifyToken = (token: string) => {
  try {
    const payload = verify(token, process.env.JWT_SECRET || '') as {
      userId: string;
      email: string;
    };
    return payload.userId;
  } catch (error) {
    return null;
  }
};

export const registerNewUser = async (
  args: RegisterUserArgs,
): Promise<{ token: string; user: UserType }> => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(args.password, 10);

    // Create new user in the database
    const user = await UserModel.create({
      email: args.email,
      password: hashedPassword,
      firstName: args.firstName,
      lastName: args.lastName,
    });

    // Generate JWT token
    const token = generateToken(user.dataValues);

    return { token, user: user.dataValues };
  } catch (err) {
    console.log(err);
    throw new Error('Unable to register new user.');
  }
};
