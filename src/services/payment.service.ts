import { Payment, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { paymentDatabaseService } from './payment.database.service';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ERROR_MESSAGES } from '../utils/constants';

const VALID_PAYMENT_METHODS = ['card', 'bank_transfer', 'crypto'] as const;
type PaymentMethod = (typeof VALID_PAYMENT_METHODS)[number];

function validatePaymentAmount(amount: number): void {
  if (amount <= 0) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_PAYMENT_AMOUNT);
  }
}

function validatePaymentMethod(method: string): asserts method is PaymentMethod {
  if (!VALID_PAYMENT_METHODS.includes(method as PaymentMethod)) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_PAYMENT_METHOD);
  }
}

export const paymentService = {
  validatePaymentAmount,
  validatePaymentMethod,

  async processPayment(
    userId: string,
    orderId: string,
    amount: number,
    currency: string,
    paymentMethod: string
  ): Promise<Payment> {
    logger.info({ userId, orderId, amount, currency, paymentMethod }, 'Processing payment');

    validatePaymentAmount(amount);
    validatePaymentMethod(paymentMethod);

    const transactionId = uuidv4();

    const payment = await paymentDatabaseService.create({
      userId,
      orderId,
      amount,
      currency,
      paymentMethod,
      transactionId,
      status: 'pending',
    });

    logger.info({ paymentId: payment.id, transactionId }, 'Payment processed successfully');

    return payment;
  },

  async getPaymentStatus(paymentId: string): Promise<Payment> {
    logger.debug({ paymentId }, 'Fetching payment status');

    const payment = await paymentDatabaseService.findOneById(paymentId);

    if (!payment) {
      throw new NotFoundError(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    logger.debug({ paymentId, status: payment.status }, 'Payment status fetched');

    return payment;
  },

  async getAllPayments(): Promise<Payment[]> {
    logger.debug('Fetching all payments');

    return paymentDatabaseService.findMany();
  },

  async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    logger.debug({ orderId }, 'Fetching payments by orderId');

    return paymentDatabaseService.findByOrderId(orderId);
  },

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    logger.debug({ userId }, 'Fetching payments by userId');

    return paymentDatabaseService.findByUserId(userId);
  },

  async updatePayment(
    id: string,
    data: { status?: string; metadata?: Prisma.InputJsonValue }
  ): Promise<Payment> {
    logger.info({ paymentId: id }, 'Updating payment');

    const payment = await paymentDatabaseService.update(id, data);

    logger.info({ paymentId: id }, 'Payment updated successfully');

    return payment;
  },

  async deletePayment(id: string): Promise<void> {
    logger.info({ paymentId: id }, 'Soft deleting payment');

    await paymentDatabaseService.softDelete(id);

    logger.info({ paymentId: id }, 'Payment deleted successfully');
  },

  async refundPayment(paymentId: string): Promise<Payment> {
    logger.info({ paymentId }, 'Refunding payment');

    const payment = await paymentDatabaseService.findOneById(paymentId);

    if (!payment) {
      throw new NotFoundError(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    if (payment.status !== 'completed') {
      throw new BadRequestError(ERROR_MESSAGES.PAYMENT_NOT_REFUNDABLE);
    }

    const refunded = await paymentDatabaseService.update(paymentId, { status: 'refunded' });

    logger.info({ paymentId }, 'Payment refunded successfully');

    return refunded;
  },
};
