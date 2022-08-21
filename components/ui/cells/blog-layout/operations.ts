import { viewBlog } from 'core/operations';

export const increaseBlogView = (blogId: number) => {
  viewBlog(blogId);
};
