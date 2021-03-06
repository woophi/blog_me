import { CommentItem } from './comment';

export type ProfileLike = {
  _id: string;
  blog: {
    blogId: number;
    title: string;
  };
};
export type ProfileQuiz = {
  quizName: string;
  quizId: number;
  finished: boolean;
  lastStep: number;
  answers: {
    [step: number]: string;
  };
  questions: {
    step: number;
    question: string;
  }[];
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
