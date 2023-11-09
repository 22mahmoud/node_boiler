import type { Response, Request } from 'express';
import type { PostsService } from './postsService';

type Deps = {
  postsService: PostsService;
};

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

  const create = async (req: Request, res: Response) => {
    const title = req.body.title as string;

    const post = await postsService.createPost({ title });

    res.json(post);
  };

  const _delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    const post = await postsService.deletePostById(id);

    res.json(post);
  };

  return { list, get, create, delete: _delete } as const;
};

export type PostsController = ReturnType<typeof createPostsController>;
