import { callUserApi } from 'core/common';
import { AdminBlogItem, BlogData } from 'core/models/admin';
import moment from 'moment';

export const getAllBlogs = (offset = 0) =>
  callUserApi<AdminBlogItem[]>('post', `api/admin/get/blogs`, {
    offset
  });

export const editBlog = (blogId: number, data: BlogData) =>
  callUserApi('put', 'api/admin/update/blog', {
    ...data,
    publishedDate: moment(
      `${data.time} ${data.publishedDate}`,
      'hh:mm YYYY-MM-DD'
    ).toDate()
  });

export const createNewBlog = (data: BlogData) =>
  callUserApi<{ blogId: number }>('post', 'api/admin/create/blog', {
    ...data,
    publishedDate: moment(
      `${data.time} ${data.publishedDate}`,
      'hh:mm YYYY-MM-DD'
    ).toDate()
  });

export const deleteBlog = (blogId: number) =>
  callUserApi('delete', 'api/admin/delete/blogs', { blogIds: [blogId] });

export const getBlogData = (blogId: number) =>
  callUserApi<BlogData>('get', `api/admin/get/blog?blogId=${blogId}`);
