export type CommentItem = {
  _id: string;
  text: string;
  user: {
    name: string;
  };
  rate: number;
  createdAt: Date;
  replies?: string[];
};

export type NewComment = {
  name: string;
  message: string;
}

export type ReplieItem = {
  _id: string;
  text: string;
  user: {
    name: string;
  };
  rate: number;
  createdAt: Date;
  parentId: string;
};