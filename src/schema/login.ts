import { z } from 'zod';

import { commonSchemas } from '@/utils/validation';

export const loginSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
});

export type LoginRequest = z.infer<typeof loginSchema>;
