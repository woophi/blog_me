import * as React from 'react';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { BlogGuestItem } from 'core/models';
import { BlogPreview } from './BlogPreview';
import { getBLogs } from 'core/operations';
import { INCREASE_BLOG_OFFSET } from 'core/constants';
import { useMediaQuery } from '@material-ui/core';

type Props = {
  blogs: BlogGuestItem[];
};

export const IndexLayout = React.memo<Props>(({ blogs = [] }) => {
  const [offset, setOffset] = React.useState(0);
  const [allBlogs, setBlogs] = React.useState(blogs);
  const [fetching, setFetching] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const lessThan750px = useMediaQuery('(max-width: 750px)');

  React.useEffect(() => {
    setBlogs(blogs);
  }, [blogs]);

  const loadMore = React.useCallback(() => {
    setFetching(true);
    const newOffset = offset + INCREASE_BLOG_OFFSET;
    getBLogs(newOffset)
      .then((newBlogs) => {
        if (!!newBlogs.length) {
          setBlogs(allBlogs.concat(newBlogs));
          return true;
        }
        return false;
      })
      .then((r) => (r ? setOffset(newOffset) : setHidden(true)))
      .finally(() => setFetching(false));
  }, [offset]);

  const hasMore =
    allBlogs.length && allBlogs.length - offset === INCREASE_BLOG_OFFSET;

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={lessThan750px ? '1fr' : "repeat(2, 1fr)"}
        gridColumnGap="1rem"
        gridRowGap="3rem"
        padding="1rem"
      >
        {allBlogs.length
          ? allBlogs.map((b) => <BlogPreview key={b.blogId} {...b} />)
          : 'nothing here yet'}
      </Box>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        flexDirection="column"
      >
        {hasMore && !hidden ? (
          <Button
            color="primary"
            onClick={loadMore}
            size="large"
            style={{
              height: 120,
            }}
          >
            {fetching ? 'Загрузка...' : 'Загрузить еще'}
          </Button>
        ) : null}
      </Box>
    </>
  );
});
