import * as React from 'react';
import Button from '@material-ui/core/Button';
import { TransitionSlide } from 'ui/atoms';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import { ReplieItem } from 'core/models';
import { Comment } from './Comment';
import { AddComment } from './AddComment';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCommentReplies } from 'core/operations';
import { INCREASE_OFFSET } from 'core/constants';
import { makeStyles } from '@material-ui/core';

type Props = {
  replieIds: string[];
  blogId: number;
  parentId?: string;
};

export const Replies = React.memo<Props>(({ replieIds = [], blogId, parentId }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [replies, setReplies] = React.useState<ReplieItem[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [hidden, setHidden] = React.useState(false);

  const classes = useStyles({});

  const handleClickOpen = React.useCallback(() => {
    setLoading(true);
    setOpen(true);
    getCommentReplies(parentId)
      .then(setReplies)
      .finally(() => setLoading(false));
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const loadMore = React.useCallback(() => {
    setLoading(true);
    const newOffset = offset + INCREASE_OFFSET;
    getCommentReplies(parentId, newOffset)
      .then(newReplies => {
        if (!!newReplies.length) {
          setReplies(replies.concat(newReplies));
          return true;
        }
        return false;
      })
      .then(r => (r ? setOffset(newOffset) : setHidden(true)))
      .finally(() => setLoading(false));
  }, [offset]);

  const hasMore = replies.length && replies.length - offset === INCREASE_OFFSET;

  return (
    <>
      <Button color="secondary" onClick={handleClickOpen} variant="outlined">
        Ответы: {replieIds.length}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={TransitionSlide}
      >
        <LinearProgress color="secondary" hidden={!loading} />
        <AppBar className={classes.appBar} position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box paddingTop="5rem">
          {replies.map(r => (
            <Comment key={r._id} {...r} />
          ))}
        </Box>
        {hasMore && !hidden ? (
          <Box>
            <Button
              color="secondary"
              onClick={loadMore}
              size="large"
              variant="outlined"
            >
              {loading ? 'Загрузка...' : 'Загрузить еще'}
            </Button>
          </Box>
        ) : null}
        <AddComment blogId={blogId} />
      </Dialog>
    </>
  );
});

const useStyles = makeStyles(theme => ({
  appBar: {
    marginBottom: '1rem'
  }
}));
