import type { Response, Request } from 'express';
import type { PostsService } from './postsService';

export const createPostsController = ({ postsService }: { postsService: PostsService }) => {
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

  return { list, get, create };
};
