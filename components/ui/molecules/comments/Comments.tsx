import * as React from 'react';
import { AddComment } from './AddComment';
import { Comment } from './Comment';
import { CommentItem, AppDispatch } from 'core/models';
import { Dispatch } from 'redux';
import { connect as redux } from 'react-redux';
import { getBlogComments } from 'core/operations';
import { INCREASE_OFFSET } from 'core/constants';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

type OwnProps = {
  blogId: number;
  comments?: CommentItem[];
};

const mapDispatch = (dispatch: Dispatch<AppDispatch>, props: OwnProps) => ({
  async loadMoreComments(offset = 0) {
    const comments = await getBlogComments(props.blogId, offset);
    if (comments.length) {
      dispatch({ type: 'LOAD_MORE_COMMENTS', payload: { comments } });
      return true;
    }
    return false;
  }
});

type Props = ReturnType<typeof mapDispatch> & OwnProps;

const CommentsPC = React.memo<Props>(
  ({ blogId, comments = [], loadMoreComments }) => {
    const [loading, setLoading] = React.useState(false);
    const [offset, setOffset] = React.useState(0);
    const [hidden, setHidden] = React.useState(false);

    const loadMore = React.useCallback(() => {
      setLoading(true);
      const newOffset = offset + INCREASE_OFFSET;
      loadMoreComments(newOffset)
        .then(r => (r ? setOffset(newOffset) : setHidden(true)))
        .finally(() => setLoading(false));
    }, [offset]);

    return (
      <>
        {comments.map(c => (
          <Comment key={c._id} {...c} />
        ))}
        {!hidden ? (
          <Box margin="1rem auto" display="flex" justifyContent="center">
            <Button
              color="secondary"
              onClick={loadMore}
              size="large"
              variant="outlined"
            >
              {loading ? 'Загрузка...' : 'Загрузить еще'}
            </Button>
          </Box>
        ) : null}
        <AddComment blogId={blogId} />
      </>
    );
  }
);

export const Comments = redux(null, mapDispatch)(CommentsPC);

export default Comments;
