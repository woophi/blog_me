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
  }
};

export type NewComment = {
  name: string;
  message: string;
}

export type ReplieItem = {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
  };
  rate: number;
  createdAt: Date;
  parentId: string;
  blog: {
    blogId: number;
  };
};