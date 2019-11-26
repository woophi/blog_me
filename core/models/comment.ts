export type CommentItem = {
  avatarSrc?: string;
  name?: string;
  createdAt?: string;
  text?: string;
  id?: string;
}

export type NewComment = {
  name: string;
  message: string;
}
