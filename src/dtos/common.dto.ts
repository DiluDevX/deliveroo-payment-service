import type {
  IdRequestPathParamsInput,
  CommonRequestQueryParamsInput,
} from '../schema/common.schema';

export interface CommonResponseDTO<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface PaginationInfoDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponseDTO<T = unknown> extends CommonResponseDTO<T[]> {
  pagination: PaginationInfoDTO;
}

export type IdRequestPathParamsDTO = IdRequestPathParamsInput;
export type CommonRequestQueryParamsDTO = CommonRequestQueryParamsInput;
