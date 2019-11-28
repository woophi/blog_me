import BlogModel from 'server/models/blogs';
import { Request, Response } from 'express';
import { HTTPStatus } from 'server/lib/models';
import * as formator from 'server/formator';

export const getBlog = async (req: Request, res: Response) => {
  const blogId = req.query['id'];
  if (!blogId) return res.send({}).status(HTTPStatus.Empty);

  const blog = await BlogModel.findById(blogId).exec();

  if (!blog) return res.sendStatus(HTTPStatus.NotFound);

  return res.send({
    id: blog.id,
    title: blog.title,
    body: blog.body,
    coverPhotoUrl: blog.coverPhotoUrl,
    publishedDate: blog.publishedDate,
    likes: blog.likes?.length ?? 0,
    comments: blog.comments?.length ?? 0
  });
};

export const getBlogs = async (req: Request, res: Response) => {
  const data = {
    offset: req.body.offset,
    limit: req.body.limit
  };

  await formator.formatData({
    offset: formator.formatNumber,
    limit: formator.formatNumber
  }, data);

  const blogs = await BlogModel.find()
    .where('deleted', undefined)
    .sort('createdAt')
    .select('title body coverPhotoUrl publishedDate')
    .skip(data.offset)
    .limit(data.limit)
    .lean();

  return res.send(blogs);
};
