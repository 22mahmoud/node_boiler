import { ObjectId } from 'mongodb';

import type { Db } from 'mongodb';
import type { Logger } from 'pino';
import type { Config } from '@/types';

type Deps = { logger: Logger; config: Config; db: Db };

export const createPostsDAL = ({ db }: Deps) => {
  const posts = db.collection('posts');

  const findOneById = (id: string | ObjectId) => {
    return posts.findOne({
      $expr: { $eq: ['$_id', id instanceof ObjectId ? id : new ObjectId(id)] },
    });
  };

  const insertOne = (doc: { title: string }) => {
    return posts.insertOne({ _id: new ObjectId(), ...doc });
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
  };
};

export type PostsDAL = ReturnType<typeof createPostsDAL>;
