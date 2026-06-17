import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must not exceed 50 characters' }),
  email: z.string().email({ message: 'Invalid email address format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
      message: 'Password must contain at least one letter and one number',
    }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const generateItinerarySchema = z.object({
  files: z
    .array(
      z.object({
        originalName: z.string(),
        filename: z.string(),
        path: z.string(),
        mimeType: z.string(),
        size: z.number(),
      })
    )
    .min(1, { message: 'At least one uploaded travel document is required' }),
});
export default { registerSchema, loginSchema, generateItinerarySchema };
