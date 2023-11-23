import type { Deps } from '@/types';
import type { CreatePost } from './postsSchema';

export const createPostsService = ({ postsDAL, postsDto }: Deps) => {
  const getPostById = async (id: string) => {
    const post = await postsDAL.findOneById(id);

    return postsDto.convertFromEntity(post);
  };

  const getPosts = async () => {
    return await postsDAL.find();
  };

  const createPost = async ({ title, body }: CreatePost) => {
    const { insertedId } = await postsDAL.insertOne({ title, body });

    return await postsDAL.findOneById(insertedId);
  };

  const deletePostById = async (id: string) => {
    return await postsDAL.deleteOneById(id);
  };

  return { createPost, getPostById, getPosts, deletePostById };
};

export type PostsService = ReturnType<typeof createPostsService>;
