import * as React from 'react';
import { BlogGuestItem } from 'core/models';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { goToSpecific } from 'core/common';

type Props = BlogGuestItem;

export const BlogPreview = React.memo<Props>(
  ({ blogId, coverPhotoUrl, publishedDate, title }) => {
    const loadBlog = React.useCallback(() => {
      const mapTitle = title
        .toLowerCase()
        .split(' ')
        .join('-');
      goToSpecific(`/${mapTitle}-${blogId}`);
    }, [blogId, title]);
    return (
      <Box
        width="75vw"
        marginX="auto"
        marginY="1rem"
        style={{
          cursor: 'pointer'
        }}
        onClick={loadBlog}
      >
        <Paper>
          <Box padding="1rem" height="450px">
            <Box>
              <img src={coverPhotoUrl} alt={title} />
            </Box>
            <Typography variant="h3" component="h1">
              {title}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {publishedDate}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
);
