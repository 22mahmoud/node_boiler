import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const postsModelSchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().trim(),
  body: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PostsModel = z.infer<typeof postsModelSchema>;
