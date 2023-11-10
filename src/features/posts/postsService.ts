import { Logger } from 'pino';

import type { PostsDAL } from './postsDAL';

export const createPostsService = ({ postsDAL }: { logger: Logger; postsDAL: PostsDAL }) => {
  const getPostById = async (id: string) => {
    return await postsDAL.findOneById(id);
  };

  const getPosts = async () => {
    return await postsDAL.find();
  };

  const createPost = async ({ title }: { title: string }) => {
    const { insertedId } = await postsDAL.insertOne({ title });

    return await postsDAL.findOneById(insertedId);
  };

  const deletePostById = async (id: string) => {
    return await postsDAL.deleteOneById(id);
  };

  return { createPost, getPostById, getPosts, deletePostById };
};

export type PostsService = ReturnType<typeof createPostsService>;
