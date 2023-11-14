import type { Request, Response } from 'express';
import type { CreatePostBody } from './postsSchema';
import type { PostsService } from './postsService';

type Deps = {
  postsService: PostsService;
};

export const createPostsController = ({ postsService }: Deps) => {
  const list = async (_req: Request, res: Response) => {
    const posts = await postsService.getPosts();

    throw new Error('test');
    res.json(posts);
  };

  const get = async (req: Request, res: Response) => {
    const id = req.params.id;

    const post = await postsService.getPostById(id);

    res.json(post);
  };

  const create = async (req: Request<any, any, CreatePostBody>, res: Response) => {
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
