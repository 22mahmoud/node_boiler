import { randomUUID } from 'node:crypto';

import type { Db, ObjectId } from 'mongodb';
import type { Logger } from 'pino';
import type { Config } from '../../utils/config';

export const createPostsDAL = ({ db }: { logger: Logger; config: Config; db: Db }) => {
  const posts = db.collection('posts');

  const findOneById = (id: string | ObjectId) => {
    return posts.findOne({ $expr: { $eq: ['$_id', id.toString()] } });
  };

  const insertOne = (doc: { title: string }) => {
    return posts.insertOne({ _id: `PST-${randomUUID()}` as any, ...doc });
  };

  const find = () => {
    return posts.find().toArray();
  };

  return {
    findOneById,
    insertOne,
    find,
  };
};

export type PostsDAL = ReturnType<typeof createPostsDAL>;
