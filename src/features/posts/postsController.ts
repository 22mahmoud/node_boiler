import type { Request, Response } from 'express';
import type { Deps } from '@/types';
import type { CreatePost } from './postsSchema';

export const createPostsController = ({ postsService }: Deps) => {
  const list = async (_req: Request, res: Response) => {
    const posts = await postsService.getPosts();

    res.json(posts);
  };

  const get = async (req: Request, res: Response) => {
    const id = req.params.id;

    const post = await postsService.getPostById(id);

    res.json(post);
  };

  const create = async (req: Request<any, any, CreatePost>, res: Response) => {
    const { title, body } = req.body;

    const post = await postsService.createPost({ title, body });

    res.json(post);
  };

  const _delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    const post = await postsService.deletePostById(id);

    res.json(post);
  };

  return {
    list,
    get,
    create,
    delete: _delete,
  };
};

export type PostsController = ReturnType<typeof createPostsController>;
