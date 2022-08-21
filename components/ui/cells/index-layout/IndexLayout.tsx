import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { INCREASE_BLOG_OFFSET } from 'core/constants';
import { AppState, BlogGuestItem } from 'core/models';
import { getBLogs } from 'core/operations';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BlogPreview } from './BlogPreview';

type Props = {
  blogs: BlogGuestItem[];
};

export const IndexLayout = React.memo<Props>(({ blogs = [] }) => {
  const [offset, setOffset] = React.useState(0);
  const [allBlogs, setBlogs] = React.useState(blogs);
  const [fetching, setFetching] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const searchResults = useSelector((state: AppState) => state.ui.searchResults);
  const searchQ = useSelector((state: AppState) => state.ui.searchQuery);

  const classes = useStyles();

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
        gridColumnGap="1rem"
        gridRowGap="3rem"
        padding="1rem"
        className={classes.content}
      >
        {searchQ && searchResults.length
          ? searchResults.map((b) => <BlogPreview key={b.blogId} {...b} />)
          : allBlogs.length
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

const useStyles = makeStyles((theme) => ({
  content: {
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
}));
