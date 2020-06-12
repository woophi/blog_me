import { callUserApi } from 'core/common';
import { UserComment, ProfileFormModel, UserCommentDict } from 'core/models';

export const getUserComments = () =>
  callUserApi<UserComment[]>('get', 'api/app/user/me/comments');
  
export const updateUserProfile = (
  data: Omit<ProfileFormModel, 'gravatarPhotoUrl' | 'userId'>
) => callUserApi('put', 'api/app/user/me', data);

export const commentsToDict = (comments: UserComment[]) =>
  comments.reduce((dict, nextComment) => {
    const blogId = nextComment.blog.blogId;
    const blogTitle = nextComment.blog.title;

    if (!!dict[blogId]) {
      dict[blogId] = {
        blogId: blogId,
        comments: [...dict[blogId].comments, nextComment],
        blogTitle,
      };
    } else {
      dict[blogId] = {
        blogId: blogId,
        comments: [nextComment],
        blogTitle,
      };
    }

    return dict;
  }, {} as UserCommentDict);
