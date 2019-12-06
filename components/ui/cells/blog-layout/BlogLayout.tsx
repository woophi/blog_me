import * as React from 'react';
import { BlogGuest } from 'core/models';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Like } from 'ui/molecules';

type Props = {
  blog: BlogGuest;
};

export const BlogLayout = React.memo<Props>(({ blog }) => {
  return (
    <Box>
      <Typography variant="h1" component="h1">
        {blog.title}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Опубликовано: {moment(blog.publishedDate).format('DD MMMM YYYY HH:MM')}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Обновлено: {moment(blog.updatedAt).format('DD MMMM YYYY HH:MM')}
      </Typography>
      <img
        src={blog.coverPhotoUrl}
        alt={blog.title}
        style={{
          minWidth: '100%',
          maxHeight: '100%'
        }}
      />
      <Typography gutterBottom dangerouslySetInnerHTML={{ __html: blog.body }} />
      <Typography variant="overline" display="block" gutterBottom>
        Комментарии: {blog.comments}
      </Typography>
      <Like blogId={blog.blogId} />
    </Box>
  );
});
