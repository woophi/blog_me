import * as React from 'react';
import Button from '@material-ui/core/Button';
import { TransitionSlide } from 'ui/atoms';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import { AppState, AppDispatch } from 'core/models';
import { Comment } from './Comment';
import { AddComment } from './AddComment';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCommentReplies } from 'core/operations';
import { INCREASE_OFFSET } from 'core/constants';
import { makeStyles } from '@material-ui/core';
import { Dispatch } from 'redux';
import { connect as redux } from 'react-redux';
import { getReplies } from 'core/selectors';

type OwnProps = {
  replieIds: string[];
  blogId: number;
  parentId: string;
};

const mapState = (state: AppState, _: OwnProps) => ({
  replies: getReplies(state)
});

const mapDispatch = (dispatch: Dispatch<AppDispatch>, props: OwnProps) => ({
  async getReplies() {
    const replies = await getCommentReplies(props.parentId);
    return dispatch({ type: 'SET_REPLIES', payload: { replies } });
  },
  async loadMoreReplies(offset = 0) {
    const replies = await getCommentReplies(props.parentId, offset);
    if (replies.length) {
      dispatch({ type: 'LOAD_MORE_REPLIES', payload: { replies } });
      return true;
    }
    return false;
  }
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch> & OwnProps;

const RepliesPC = React.memo<Props>(
  ({ replieIds = [], blogId, parentId, replies, getReplies, loadMoreReplies }) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [offset, setOffset] = React.useState(0);
    const [hidden, setHidden] = React.useState(false);

    const classes = useStyles({});

    const handleClickOpen = React.useCallback(() => {
      setLoading(true);
      setOpen(true);
      getReplies().finally(() => setLoading(false));
    }, []);

    const handleClose = React.useCallback(() => {
      setOpen(false);
    }, []);

    const loadMore = React.useCallback(() => {
      setLoading(true);
      const newOffset = offset + INCREASE_OFFSET;
      loadMoreReplies(newOffset)
        .then(r => (r ? setOffset(newOffset) : setHidden(true)))
        .finally(() => setLoading(false));
    }, [offset]);

    return (
      <>
        <Button color="secondary" onClick={handleClickOpen} variant="outlined">
          {replieIds.length ? `Ответы: ${replieIds.length}` : 'Ответить'}
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
          {!hidden ? (
            <Box margin="1rem auto" display="flex" justifyContent="center">
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
          <AddComment blogId={blogId} parentCommentId={parentId} />
        </Dialog>
      </>
    );
  }
);

export const Replies = redux(mapState, mapDispatch)(RepliesPC);

const useStyles = makeStyles(theme => ({
  appBar: {
    marginBottom: '1rem'
  }
}));
