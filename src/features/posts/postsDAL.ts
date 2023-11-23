import { ObjectId } from 'mongodb';

import type { Deps, PostsModel } from '@/types';

export const createPostsDAL = ({ db }: Deps) => {
  const posts = db.collection<PostsModel>('posts');

  const findOneById = (id: string | ObjectId) => {
    return posts.findOne({
      $expr: { $eq: ['$_id', id instanceof ObjectId ? id : new ObjectId(id)] },
    });
  };

  const insertOne = (doc: Omit<PostsModel, 'created_at' | 'updated_at' | '_id'>) => {
    return posts.insertOne({
      ...doc,
      created_at: new Date(),
      updated_at: new Date(),
      _id: new ObjectId(),
    });
  };

  const find = () => {
    return posts.find().toArray();
  };

  const deleteOneById = (id: string | ObjectId) => {
    return posts.deleteOne({ $expr: { $eq: ['$_id', id.toString()] } });
  };

  return {
    findOneById,
    insertOne,
    find,
    deleteOneById,
  } as const;
};

export type PostsDAL = ReturnType<typeof createPostsDAL>;
