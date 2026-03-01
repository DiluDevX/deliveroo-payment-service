import { CommonResponseDTO, PaginatedResponseDTO } from './common.dto';

export interface CreateUserRequestBodyDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserRequestBodyDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface UserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserResponseDTO = CommonResponseDTO<UserResponseDTO>;
export type GetUserResponseDTO = CommonResponseDTO<UserResponseDTO>;
export type UpdateUserResponseDTO = CommonResponseDTO<UserResponseDTO>;
export type DeleteUserResponseDTO = CommonResponseDTO<null>;
export type GetUsersResponseDTO = PaginatedResponseDTO<UserResponseDTO>;
