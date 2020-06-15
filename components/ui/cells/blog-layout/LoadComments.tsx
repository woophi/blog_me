import * as React from 'react';
import Button from '@material-ui/core/Button';
import { getComments } from 'ui/molecules/comments';
import { AppState } from 'core/models';
import { connect as redux } from 'react-redux';

import dynamic from 'next/dynamic';
import { getCommentsByBlogId } from 'core/selectors';

const Comments = dynamic(() => import('ui/molecules/comments/Comments'), {
  ssr: false
});

type OwnProps = {
  commentsCount: number;
  blogId: number;
};

const mapState = (state: AppState, props: OwnProps) => ({
  blogComments: getCommentsByBlogId(state)(props.blogId)
});

type Props = ReturnType<typeof mapState> & OwnProps;

const LoadCommentsPC = React.memo<Props>(
  ({ commentsCount, blogComments, blogId }) => {
    const [text, setText] = React.useState(`Комментарии: ${commentsCount}`);
    const [loading, setLoading] = React.useState(false);
    const [hidden, setHidden] = React.useState(true);

    const previewLoad = React.useCallback(() => {
      setText('Загрузить комментарии');
    }, []);
    const previewUnset = React.useCallback(() => {
      setText(`Комментарии: ${commentsCount}`);
    }, []);

    const loadComments = React.useCallback(() => {
      setLoading(true);
      getComments(blogId)
        .then(() => setHidden(false))
        .finally(() => setLoading(false));
    }, []);

    if (hidden) {
      return (
        <Button
          color="secondary"
          size="large"
          fullWidth
          onMouseEnter={previewLoad}
          onMouseLeave={previewUnset}
          onClick={loadComments}
        >
          {loading ? 'Загрузка' : text}
        </Button>
      );
    }
    return <Comments comments={blogComments} blogId={blogId} />;
  }
);

export const LoadComments = redux(mapState)(LoadCommentsPC);
