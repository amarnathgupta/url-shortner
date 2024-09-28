import { z } from 'zod';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

export const validatePassword = (password) => passwordSchema.safeParse(password);