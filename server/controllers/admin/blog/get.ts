import BlogModel from 'server/models/blogs';
import { Request, Response } from 'express-serve-static-core';
import { HTTPStatus } from 'server/lib/models';
import * as formator from 'server/formator';

export const getBlog = async (req: Request, res: Response) => {
  const blogId = req.query['blogId'];
  if (!blogId) return res.status(HTTPStatus.Empty).send({});

  const blog = await BlogModel.findOne({ blogId }).exec();

  if (!blog) return res.sendStatus(HTTPStatus.NotFound);

  return res.send({
    blogId: blog.blogId,
    title: blog.title,
    body: blog.body,
    coverPhotoUrl: blog.coverPhotoUrl,
    publishedDate: blog.publishedDate,
    likes: blog.likes?.length ?? 0,
    comments: blog.comments?.length ?? 0,
    shortText: blog.shortText,
    draft: blog.draft
  });
};

export const getBlogs = async (req: Request, res: Response) => {
  const data = {
    offset: req.body.offset,
    limit: 50
  };

  await formator.formatData(
    {
      offset: formator.formatNumber,
      limit: formator.formatNumber
    },
    data
  );

  const blogs = await BlogModel.find()
    .where('deleted', null)
    .sort('createdAt')
    .select('title coverPhotoUrl publishedDate blogId shortText draft -_id')
    .skip(data.offset)
    .limit(data.limit)
    .lean();

  return res.send(blogs);
};
