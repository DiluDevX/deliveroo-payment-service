import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

const PRISMA_NOT_FOUND_CODE = 'P2025';

export const userDatabaseService = {
  async findMany(where?: Prisma.UserWhereInput): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  },

  async findOneById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  async findOneByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('A user with this email already exists');
      }
      throw error;
    }
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`User with id ${id} not found`);
      }
      throw error;
    }
  },

  async softDelete(id: string): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`User with id ${id} not found`);
      }
      throw error;
    }
  },

  async hardDelete(id: string): Promise<User> {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`User with id ${id} not found`);
      }
      throw error;
    }
  },
};

logger.debug('UserDatabaseService initialized');
