import { User } from '@prisma/client';
import { userDatabaseService } from './user.database.service';
import { hashPassword, comparePasswords } from '../utils/password';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ERROR_MESSAGES } from '../utils/constants';

export const userService = {
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    logger.info({ email }, 'Creating new user');

    await userService.validateEmailUniqueness(email);

    const hashedPassword = await hashPassword(password);

    const user = await userDatabaseService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    logger.info({ userId: user.id, email }, 'User created successfully');

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async authenticateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    logger.info({ email }, 'Authenticating user');

    const user = await userDatabaseService.findOneByEmail(email);

    if (!user) {
      // Use the same error message to prevent user enumeration
      logger.warn({ email }, 'Authentication failed: user not found');
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      logger.warn({ email }, 'Authentication failed: invalid password');
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    logger.info({ userId: user.id, email }, 'User authenticated successfully');

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async validateEmailUniqueness(email: string): Promise<void> {
    logger.debug({ email }, 'Checking email uniqueness');

    const existingUser = await userDatabaseService.findOneByEmail(email);

    if (existingUser) {
      logger.warn({ email }, 'Email already in use');
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
  },

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    logger.debug({ userId: id }, 'Fetching user by id');

    const user = await userDatabaseService.findOneById(id);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    logger.debug('Fetching all users');

    const users = await userDatabaseService.findMany();

    return users.map(({ password: _password, ...user }) => user);
  },

  async updateUser(
    id: string,
    data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>>
  ): Promise<Omit<User, 'password'>> {
    logger.info({ userId: id }, 'Updating user');

    const updateData: typeof data = { ...data };

    if (updateData.email) {
      const existing = await userDatabaseService.findOneByEmail(updateData.email);
      if (existing && existing.id !== id) {
        throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const user = await userDatabaseService.update(id, updateData);

    logger.info({ userId: id }, 'User updated successfully');

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async deleteUser(id: string): Promise<void> {
    logger.info({ userId: id }, 'Soft deleting user');

    await userDatabaseService.softDelete(id);

    logger.info({ userId: id }, 'User deleted successfully');
  },
};
