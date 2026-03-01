import { z } from 'zod';

export const healthCheckSchema = z.object({}).optional();

export type HealthCheckInput = z.infer<typeof healthCheckSchema>;
