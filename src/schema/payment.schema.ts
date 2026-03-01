import { z } from 'zod';

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'] as const;
const VALID_PAYMENT_METHODS = ['card', 'bank_transfer', 'crypto'] as const;
const VALID_STATUSES = ['pending', 'completed', 'failed', 'refunded'] as const;

export const createPaymentSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  orderId: z.string().uuid('orderId must be a valid UUID'),
  amount: z.number().positive('Amount must be a positive number'),
  currency: z.enum(VALID_CURRENCIES).default('USD'),
  paymentMethod: z.enum(VALID_PAYMENT_METHODS, {
    errorMap: () => ({ message: 'paymentMethod must be one of: card, bank_transfer, crypto' }),
  }),
});

export const updatePaymentSchema = z
  .object({
    status: z
      .enum(VALID_STATUSES, {
        errorMap: () => ({
          message: 'status must be one of: pending, completed, failed, refunded',
        }),
      })
      .optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
