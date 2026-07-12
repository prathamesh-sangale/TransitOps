import { z } from 'zod';

export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format')
  }).passthrough()
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional()
  }).passthrough()
});
