import { randomUUID } from 'node:crypto';

import type { Db, ObjectId } from 'mongodb';
import type { Logger } from 'pino';
import type { Config } from '../../utils/config';
import { RESOLVER } from 'awilix';

export const createPostsDAL = ({ db, logger }: { logger: Logger; config: Config; db: Db }) => {
  const posts = db.collection('posts');

  const findOneById = (id: string | ObjectId) => {
    return posts.findOne({ $expr: { $eq: ['$_id', id.toString()] } });
  };

  const insertOne = (doc: { title: string }) => {
    return posts.insertOne({ _id: `PST-${randomUUID()}` as any, ...doc });
  };

  const find = () => {
    logger.info('TEST');

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

// @ts-ignore
createPostsDAL[RESOLVER] = {
  name: 'postsDAL',
};

export type PostsDAL = ReturnType<typeof createPostsDAL>;
