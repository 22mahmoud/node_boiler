import { RESOLVER } from 'awilix';
import type { PostsDAL } from './postsDAL';

export const createPostsService = ({ postsDAL }: { postsDAL: PostsDAL }) => {
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

  return { createPost, getPostById, getPosts };
};

// @ts-ignore
createPostsService[RESOLVER] = {};

export type PostsService = ReturnType<typeof createPostsService>;
