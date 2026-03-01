import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { paymentService } from '../services/payment.service';
import { logger } from '../utils/logger';
import type { CreatePaymentRequestBodyDTO } from '../dtos/payment.dto';

export const paymentController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, orderId, amount, currency, paymentMethod } =
        req.body as CreatePaymentRequestBodyDTO;

      logger.info({ userId, orderId, amount }, 'Controller: process payment request');

      const payment = await paymentService.processPayment(
        userId,
        orderId,
        amount,
        currency,
        paymentMethod
      );

      logger.info({ paymentId: payment.id }, 'Controller: payment processed');

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.query as { userId?: string };

      logger.info({ userId }, 'Controller: get all payments request');

      const payments = userId
        ? await paymentService.getPaymentsByUserId(userId)
        : await paymentService.getAllPayments();

      logger.info({ count: payments.length }, 'Controller: payments fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
        pagination: {
          page: 1,
          limit: payments.length,
          total: payments.length,
          totalPages: 1,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ paymentId: id }, 'Controller: get payment by id request');

      const payment = await paymentService.getPaymentStatus(id);

      logger.info({ paymentId: id }, 'Controller: payment fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.params['orderId'] as string;

      logger.info({ orderId }, 'Controller: get payments by orderId request');

      const payments = await paymentService.getPaymentsByOrderId(orderId);

      logger.info({ orderId, count: payments.length }, 'Controller: payments by order fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const updateData = req.body as { status?: string; metadata?: Prisma.InputJsonValue };

      logger.info({ paymentId: id }, 'Controller: update payment request');

      const payment = await paymentService.updatePayment(id, updateData);

      logger.info({ paymentId: id }, 'Controller: payment updated');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ paymentId: id }, 'Controller: delete payment request');

      await paymentService.deletePayment(id);

      logger.info({ paymentId: id }, 'Controller: payment deleted');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async refund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ paymentId: id }, 'Controller: refund payment request');

      const payment = await paymentService.refundPayment(id);

      logger.info({ paymentId: id }, 'Controller: payment refunded');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },
};
