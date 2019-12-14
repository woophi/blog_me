import * as React from 'react';
import { BlogGuest } from 'core/models';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Like } from 'ui/molecules';
import { LoadComments } from './LoadComments';

type Props = {
  blog: BlogGuest;
};

export const BlogLayout = React.memo<Props>(({ blog }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box minWidth="50vw" padding="1rem" maxWidth="720px">
        <Typography variant="h1" component="h1" gutterBottom>
          {blog.title}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          color="textSecondary"
        >
          Опубликовано: {moment(blog.publishedDate).format('DD MMMM YYYY HH:MM')}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          color="textSecondary"
        >
          Обновлено: {moment(blog.updatedAt).format('DD MMMM YYYY HH:MM')}
        </Typography>
      </Box>
      <img
        src={blog.coverPhotoUrl}
        alt={blog.title}
        style={{
          width: '100%',
          maxHeight: '100vh'
        }}
      />
      <Box minWidth="50vw" padding="1rem" maxWidth="720px">
        <Typography
          component="div"
          gutterBottom
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
      </Box>
      <Like blogId={blog.blogId} />
      <Box minWidth="50vw" padding="1rem" maxWidth="720px" marginBottom="2rem">
        <LoadComments commentsCount={blog.comments} blogId={blog.blogId} />
      </Box>
    </Box>
  );
});
