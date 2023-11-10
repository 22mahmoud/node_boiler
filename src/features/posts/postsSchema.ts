import { z } from 'zod';

export const createPostBodySchema = z.object({
  title: z.string().trim(),
  body: z.string(),
});

export type CreatePostBodySchema = z.infer<typeof createPostBodySchema>;
