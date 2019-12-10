import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core';
import { connect as redux } from 'react-redux';
import { AppState } from 'core/models';
import { canUserComment } from 'core/selectors';

const mapState = (state: AppState) => ({
  canAccess: canUserComment(state)
});

type Props = ReturnType<typeof mapState>;

const MenuCommentPC = React.memo<Props>(({ canAccess }) => {
  const classes = useStyles({});

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  function handleToggle() {
    setOpen(prevOpen => !prevOpen);
  }

  function handleClose(event: React.MouseEvent<EventTarget>) {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }
  if (!canAccess) return null;
  return (
    <>
      <IconButton
        onClick={handleToggle}
        className={classes.butnMenu}
        ref={anchorRef}
      >
        <MoreVertIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        placement="left-start"
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top'
            }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
});

export const MenuComment = redux(mapState)(MenuCommentPC);

const useStyles = makeStyles(theme => ({
  butnMenu: {
    position: 'absolute',
    top: '-12px',
    right: '-16px'
  }
}));
