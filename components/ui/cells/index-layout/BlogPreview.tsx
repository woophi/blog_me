import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { goToSpecific } from 'core/common';
import { BlogGuestItem } from 'core/models';
import moment from 'moment';
import * as React from 'react';

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
      <Box
        minWidth="320px"
        style={{
          cursor: 'pointer',
        }}
        onClick={loadBlog}
        display="flex"
        flexDirection="column"
      >
        <Box width="100%" height="100%" maxHeight="505px">
          <picture>
            <source type="image/webp" data-srcset={coverPhotoThumbnail + '.webp'} />
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
        </Box>
        <Box width="100%" padding="1rem" display="flex" flexDirection="column">
          <Typography variant="h5" component="h1" title={title} gutterBottom>
            {title}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Опубликовано: {moment(publishedDate).fromNow()}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Прочтений: {views}
          </Typography>
        </Box>
      </Box>
    );
  }
);

