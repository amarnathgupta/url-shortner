import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');

export const validateEmail = (email) => emailSchema.safeParse(email);