import { z } from 'zod';

export const createPostBodySchema = z.object({
  title: z.string().trim(),
});

export type CreatePostBodySchema = z.infer<typeof createPostBodySchema>;
