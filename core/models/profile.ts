import { CommentItem } from './comment';

export type ProfileLike = {
  blogId: number;
  blogName: string;
};
export type ProfileQuiz = {
  quizId: number;
  quizTitle: string;
};

export type UserComment = Omit<CommentItem, 'blog' | 'parent'> & {
  blog: {
    blogId: number;
    title: string;
  };
};

export type UserCommentDict = {
  [blogId: number]: {
    comments: UserComment[];
    blogId: number;
    blogTitle: string;
  };
};

export type ProfileState = {
  comments: UserCommentDict;
};

export type ProfileFormModel = {
  name: string;
  email: string;
  gravatarPhotoUrl: string;
  userId: string;
};
