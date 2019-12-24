import * as React from 'react';
import { BlogGuestItem } from 'core/models';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import moment from 'moment';
import { goToSpecific } from 'core/common';

type Props = {
  blog: BlogGuestItem;
};

export const BlogSearchPreview = React.memo<Props>(({ blog }) => {
  const classes = useStyles({});

  const handleClick = React.useCallback(() => {
    const mapTitle = blog.title
      .toLowerCase()
      .split(' ')
      .join('-');
    goToSpecific(`/post/${mapTitle}-${blog.blogId}`);
  }, [blog.blogId, blog.title]);

  return (
    <Card className={classes.card} elevation={6} onClick={handleClick}>
      <CardActionArea className={classes.actionArea}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {blog.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {blog.shortText}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Опубликовано: {moment(blog.publishedDate).format('DD MMMM YYYY HH:MM')}
            </Typography>
          </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
});

const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      display: 'flex',
      maxWidth: 320,
      margin: '1rem',
      cursor: 'pointer'
    },
    details: {
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      flex: '1 0 auto'
    },
    actionArea: {
      display: 'flex'
    }
  })
);
