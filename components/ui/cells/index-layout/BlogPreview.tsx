import * as React from 'react';
import { BlogGuestItem } from 'core/models';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { goToSpecific } from 'core/common';
import { theme } from 'core/lib';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import VisibilityIcon from '@material-ui/icons/Visibility';

type Props = BlogGuestItem;

export const BlogPreview = React.memo<Props>(
  ({ blogId, coverPhotoUrl, publishedDate, title, views }) => {
    const loadBlog = React.useCallback(() => {
      const mapTitle = title.toLowerCase().split(' ').join('-');
      goToSpecific(`/post/${mapTitle}-${blogId}`);
    }, [blogId, title]);

    const indexOfUpload = coverPhotoUrl.indexOf('upload/') + 7;
    const coverPhotoThumbnail =
      coverPhotoUrl.substr(0, indexOfUpload) +
      'h_400/' +
      coverPhotoUrl.substr(indexOfUpload);
    return (
      <Zoom in mountOnEnter timeout={1000}>
        <Box
          minWidth="320px"
          width="25vw"
          margin="2rem"
          style={{
            cursor: 'pointer',
          }}
          onClick={loadBlog}
        >
          <Paper elevation={3}>
            <Box padding="1rem" height="450px">
              <Box width="100%" height="100%" position="relative">
                <picture>
                  <source
                    type="image/webp"
                    data-srcset={coverPhotoThumbnail + '.webp'}
                  />
                  <img
                    alt={title}
                    data-src={coverPhotoThumbnail + '.jpg'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    className="lazyload"
                  />
                </picture>
                <Box
                  position="absolute"
                  zIndex="1"
                  bottom="0"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                  }}
                  width="100%"
                  padding="1rem"
                  boxShadow={theme.shadows}
                  display="flex"
                  flexDirection="column"
                >
                  <Typography variant="h5" component="h1" title={title} gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Опубликовано:{' '}
                    {moment(publishedDate).format('DD MMMM YYYY HH:MM')}
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary">
                      Прочесть
                    </Button>
                    <Box display="flex" alignItems="center">
                      <VisibilityIcon />{' '}
                      <Box component="span" marginLeft=".5rem">
                        <Typography component="span" color="textSecondary">
                          {views}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Zoom>
    );
  }
);
