import { Logger } from 'pino';

import { CreatePostBody } from './postsSchema';

import type { PostsDAL } from './postsDAL';

export const createPostsService = ({ postsDAL }: { logger: Logger; postsDAL: PostsDAL }) => {
  const getPostById = async (id: string) => {
    return await postsDAL.findOneById(id);
  };

  const getPosts = async () => {
    return await postsDAL.find();
  };

  const createPost = async ({ title, body }: CreatePostBody) => {
    const { insertedId } = await postsDAL.insertOne({ title, body });

    return await postsDAL.findOneById(insertedId);
  };

  const deletePostById = async (id: string) => {
    return await postsDAL.deleteOneById(id);
  };

  return { createPost, getPostById, getPosts, deletePostById };
};

export type PostsService = ReturnType<typeof createPostsService>;
