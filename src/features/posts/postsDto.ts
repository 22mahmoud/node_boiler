import { omit } from 'ramda';
import { z } from 'zod';

import { postsModelSchema } from './postsModel';

import type { PostsModel } from './postsModel';

export const postsDTOSchema = postsModelSchema.omit({ _id: true }).extend({
  id: z.string(),
});

export type PostsDTO = z.infer<typeof postsDTOSchema>;

export const createPostsDTO = () => ({
  convertFromEntity(entity: PostsModel | null) {
    if (!entity) return null;

    const candidate: PostsDTO = {
      ...omit(['_id'], entity),
      id: entity._id.toHexString(),
    };

    return postsDTOSchema.parse(candidate);
  },
});

export type PostsDTOFactory = ReturnType<typeof createPostsDTO>;
