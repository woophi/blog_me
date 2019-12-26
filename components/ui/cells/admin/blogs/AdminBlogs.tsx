import * as React from 'react';
import { Block } from 'ui/atoms/Block';
import { LinkButton } from 'ui/atoms/Links';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { AdminBlogItem } from 'core/models/admin';
import { getAllBlogs } from './operations';
import { INCREASE_OFFSET } from 'core/constants';
import moment from 'moment';

export const AdminBlogs = React.memo(() => {
  const [offset, setOffset] = React.useState(0);
  const [allBlogs, setBlogs] = React.useState<AdminBlogItem[]>([]);
  React.useEffect(() => {
    getAllBlogs().then(setBlogs);
  }, []);

  const loadMore = React.useCallback(() => {
    const newOffset = offset + INCREASE_OFFSET;
    getAllBlogs(newOffset)
      .then(newBlogs => {
        if (!!newBlogs.length) {
          setBlogs(allBlogs.concat(newBlogs));
          return true;
        }
        return false;
      })
      .then(r => (r ? setOffset(newOffset) : null));
  }, [offset]);

  return (
    <>
      <Box flexDirection="column" flex={1}>
        <LinkButton
          href="/admin/create/blog"
          color="primary"
          variant="contained"
          label="Создать новый блог"
          style={{
            marginLeft: 16
          }}
        />
        <Box mt={2} display="flex" flexWrap="wrap">
          {allBlogs.map((b, i) => (
            <Block
              key={i}
              title={b.title}
              imgSrc={b.coverPhotoUrl}
              subTitle={
                <>
                  {b.draft ? 'Черновик' : ''} {moment(b.publishedDate).format('DD MM YYYY')}
                </>
              }
              href={`/admin/blogs/edit/${b.blogId}`}
            />
          ))}
        </Box>
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          flexDirection="column"
        >
          <Button
            color="primary"
            onClick={loadMore}
            size="large"
            style={{
              height: 120
            }}
          >
            {'Загрузить еще'}
          </Button>
        </Box>
      </Box>
    </>
  );
});
