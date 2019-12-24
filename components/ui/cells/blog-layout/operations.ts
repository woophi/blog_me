import { VisitorCookie } from 'core/models';
import { getCookie } from 'core/cookieManager';
import { viewBlog } from 'core/operations';

export const increaseBlogView = (blogId: number) => {
  const cookieView = getCookie(VisitorCookie.View);
  const blogIds = cookieView.split(',');
  if (!blogIds.some(id => Number(id) === blogId)) {
    viewBlog(blogId);
  }
};
