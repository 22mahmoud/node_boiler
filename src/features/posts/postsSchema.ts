import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().trim()
  }),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
