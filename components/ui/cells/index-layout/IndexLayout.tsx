import * as React from 'react';
import Box from '@material-ui/core/Box';
import { BlogGuestItem } from 'core/models';
import { BlogPreview } from './BlogPreview';

type Props = {
  blogs: BlogGuestItem[];
};

export const IndexLayout = React.memo<Props>(({ blogs = [] }) => {
  return (
    <Box display="flex" flexDirection="column">
      {blogs.length
        ? blogs.map(b => <BlogPreview key={b.blogId} {...b} />)
        : 'nothing here yet'}
    </Box>
  );
});
