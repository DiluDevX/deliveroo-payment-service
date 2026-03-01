import { z } from 'zod';
import { emailSchema, passwordSchema } from './common.schema';

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').trim(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').trim(),
  email: emailSchema,
  password: passwordSchema,
});

export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name is too long')
      .trim()
      .optional(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name is too long')
      .trim()
      .optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
