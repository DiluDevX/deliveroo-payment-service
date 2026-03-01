import { CommonResponseDTO, PaginatedResponseDTO } from './common.dto';

export interface CreatePaymentRequestBodyDTO {
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface UpdatePaymentRequestBodyDTO {
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResponseDTO {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePaymentResponseDTO = CommonResponseDTO<PaymentResponseDTO>;
export type GetPaymentResponseDTO = CommonResponseDTO<PaymentResponseDTO>;
export type UpdatePaymentResponseDTO = CommonResponseDTO<PaymentResponseDTO>;
export type DeletePaymentResponseDTO = CommonResponseDTO<null>;
export type GetPaymentsResponseDTO = PaginatedResponseDTO<PaymentResponseDTO>;
