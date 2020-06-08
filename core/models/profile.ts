export type ProfileData = {
  userId: string;
  email: string;
  name: string;
  gravatarPhotoUrl?: string;
  comments: ProfileComment[];
  likes: ProfileLike[];
  quizzes: ProfileQuiz[];
};

export type ProfileComment = {
  blogId: number;
  blogName: string;
  comment: string;
  id: string;
  date: string;
};

export type ProfileLike = {
  blogId: number;
  blogName: string;
};
export type ProfileQuiz = {
  quizId: number;
  quizTitle: string;
};
