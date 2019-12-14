export type CommentItem = {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
  };
  rate: number;
  createdAt: Date;
  replies?: string[];
  blog: {
    blogId: number;
  };
  parent?: string;
};

export type NewComment = {
  name: string;
  message: string;
}