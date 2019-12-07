import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { BlogGuestItem } from 'core/models';
import { BlogPreview } from './BlogPreview';
import { getBLogs } from 'core/operations';

type Props = {
  blogs: BlogGuestItem[];
};

export const IndexLayout = React.memo<Props>(({ blogs = [] }) => {
  const [offset, setOffset] = React.useState(0);
  const [allBlogs, setBlogs] = React.useState(blogs);
  const [fetching, setFetching] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    setBlogs(blogs);
  }, [blogs]);

  const loadMore = React.useCallback(() => {
    setFetching(true);
    const newOffset = offset + 50;
    getBLogs(newOffset)
      .then(newBlogs => {
        if (!!newBlogs.length) {
          setBlogs(allBlogs.concat(newBlogs));
          return true;
        }
        return false;
      })
      .then(r => r ? setOffset(newOffset) : setHidden(true))
      .finally(() => setFetching(false));
  }, [offset]);
  return (
    <Box display="flex" flexDirection="column">
      {allBlogs.length
        ? allBlogs.map(b => <BlogPreview key={b.blogId} {...b} />)
        : 'nothing here yet'}

      {allBlogs.length && !hidden ? (
        <Button
          color="primary"
          onClick={loadMore}
          size="large"
          style={{
            height: 120
          }}
        >
          {fetching ? 'Загрузка...' : 'Загрузить еще'}
        </Button>
      ) : null}
    </Box>
  );
});
