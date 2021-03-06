import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
// import { MenuComment } from './Menu';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { CommentItem } from 'core/models';
import { Replies } from './Replies';
import Zoom from '@material-ui/core/Zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export const Comment = React.memo<CommentItem>(
  ({ createdAt, user, text, replies = [], rate, _id, blog, parent }) => {
    const classes = useStyles({});
    return (
      <Zoom in mountOnEnter timeout={1000}>
        <Paper elevation={4} className={classes.paper}>
          <div className={classes.topText}>
            {user?.gravatarPhotoUrl ? (
              <Avatar src={user.gravatarPhotoUrl} className={classes.avatar} />
            ) : (
              <Avatar className={classes.avatar}>
                <Icon style={{ paddingLeft: 2 }}>
                  <FontAwesomeIcon icon={faUser} />
                </Icon>
              </Avatar>
            )}
            <div className={classes.text}>
              <Typography
                noWrap
                title={user?.name}
                className={classes.nickname}
                component="p"
              >
                {user?.name}
              </Typography>
              <Typography component="p" color="textSecondary">
                {moment(createdAt).format('YYYY-MM-DD HH:mm')}
              </Typography>
            </div>
            {/* <MenuComment blogId={blog?.blogId} commentId={_id} /> */}
          </div>
          <Typography component="p" className={classes.content}>
            {text}
          </Typography>
          {!parent && (
            <Replies replieIds={replies} parentId={_id} blogId={blog?.blogId} />
          )}
        </Paper>
      </Zoom>
    );
  }
);

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: '0 auto .5rem',
    padding: '1rem',
    maxWidth: '600px',
    width: '100%',
  },
  topText: {
    display: 'flex',
    position: 'relative',
    marginBottom: '.75rem',
  },
  avatar: {
    margin: 'auto 1rem auto 0',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  nickname: {
    maxWidth: 160,
  },
}));
