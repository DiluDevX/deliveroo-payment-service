import { CommonResponseDTO } from './common.dto';

export interface HealthResponseDTO {
  status: string;
  timestamp: string;
  uptime: number;
}

export type HealthCheckResponseDTO = CommonResponseDTO<HealthResponseDTO>;
