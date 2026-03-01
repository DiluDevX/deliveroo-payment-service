import { Prisma, Payment } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

const PRISMA_NOT_FOUND_CODE = 'P2025';

export const paymentDatabaseService = {
  async findMany(where?: Prisma.PaymentWhereInput): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  },

  async findOneById(id: string): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  async findByOrderId(orderId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: {
        orderId,
        deletedAt: null,
      },
    });
  },

  async findByUserId(userId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  },

  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    try {
      return await prisma.payment.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('A payment with this transactionId already exists');
      }
      throw error;
    }
  },

  async update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    try {
      return await prisma.payment.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`Payment with id ${id} not found`);
      }
      throw error;
    }
  },

  async softDelete(id: string): Promise<Payment> {
    try {
      return await prisma.payment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`Payment with id ${id} not found`);
      }
      throw error;
    }
  },

  async hardDelete(id: string): Promise<Payment> {
    try {
      return await prisma.payment.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`Payment with id ${id} not found`);
      }
      throw error;
    }
  },
};

logger.debug('PaymentDatabaseService initialized');
