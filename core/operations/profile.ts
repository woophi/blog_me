import { callUserApi } from 'core/common';
import * as models from 'core/models';

export const getUserComments = () =>
  callUserApi<models.UserComment[]>('get', 'api/app/user/me/comments');

export const getUserLikes = () =>
  callUserApi<models.ProfileLike[]>('get', 'api/app/user/me/likes');

export const getUserQuizzes = () =>
  callUserApi<models.ProfileQuiz[]>('get', 'api/app/user/me/quizzes');

export const updateUserProfile = (
  data: Omit<models.ProfileFormModel, 'gravatarPhotoUrl' | 'userId'>
) => callUserApi('put', 'api/app/user/me', data);

export const commentsToDict = (comments: models.UserComment[]) =>
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
  }, {} as models.UserCommentDict);
