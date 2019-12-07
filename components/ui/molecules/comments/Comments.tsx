import * as React from 'react';
import { AddComment } from './AddComment';
import { Comment } from './Comment';
import { CommentItem } from 'core/models';

type Props = {
  blogId: number;
  comments?: CommentItem[];
}

export const Comments = React.memo<Props>(({
  blogId, comments = []
}) => {
  

  return (
    <>
      {comments.map(c => (
        <Comment key={c._id} {...c} />
      ))}
      <AddComment blogId={blogId} />
    </>
  );
});
