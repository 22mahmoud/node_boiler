import { z } from 'zod';

export const postsModelSchema = z.object({
  title: z.string().trim(),
  body: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PostsModel = z.infer<typeof postsModelSchema>;
