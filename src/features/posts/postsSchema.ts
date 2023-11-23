import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim(),
  body: z.string(),
});

export type CreatePost = z.infer<typeof createPostSchema>;
