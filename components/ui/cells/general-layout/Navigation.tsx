import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { goToSpecific } from 'core/common';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, createStyles, fade } from '@material-ui/core';
import { SearchResults } from './SearchResults';
import { Dispatch, compose } from 'redux';
import { AppDispatch, AppState, SearchStatus } from 'core/models';
import { connect } from 'react-redux';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { getUserProfileUrl, getUserId } from 'core/selectors';
import Avatar from '@material-ui/core/Avatar';
import { logout, checkAuth } from 'core/operations/auth';
import { ModalDialog } from 'ui/atoms';
import { AuthButtons } from 'ui/molecules/comments/AuthButtons';

type Props = {
  children: React.ReactElement;
};

function HideOnScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const mapState = (state: AppState) => ({
  query: state.ui.searchQuery,
  searchStatus: state.ui.searchStatus,
  userPicture: getUserProfileUrl(state),
  userId: getUserId(state)
});

const mapDispatch = (dispatch: Dispatch<AppDispatch>) => ({
  search(payload: string) {
    dispatch({ type: 'SET_SEARCH_QUERY', payload });
  }
});

type NavigationProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  WithRouterProps;

const NavigationPC = React.memo<NavigationProps>(
  ({ router, searchStatus, query, search, userPicture, userId }) => {
    const classes = useStyles({});

    const [show, setShow] = React.useState(false);
    const [openDialog, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    React.useEffect(() => {
      checkAuth();
    }, []);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = React.useCallback(() => {
      handleClose();
      logout();
    }, []);
    const goHome = React.useCallback(() => {
      goToSpecific('/');
    }, []);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        search(e.target.value);
      },
      [search]
    );
    const closeModal = React.useCallback(() => {
      setOpen(false);
    }, []);

    const getIcon = React.useCallback(() => {
      switch (searchStatus) {
        case SearchStatus.update:
          return <Icon className="fas fa-cog fa-spin" />;
        case SearchStatus.error:
          return <Icon className="fas fa-exclamation-triangle" color="error" />;
        default:
          return <SearchIcon />;
      }
    }, [searchStatus]);

    return (
      <>
        <CssBaseline />
        <HideOnScroll>
          <AppBar>
            <Toolbar>
              {router.route !== '/' ? (
                <IconButton onClick={goHome}>
                  <ArrowBackIcon />
                </IconButton>
              ) : null}
              <div className={classes.search}>
                <div className={classes.searchIcon}>{getIcon()}</div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                  onChange={handleChange}
                  value={query}
                />
              </div>
              {userId ? (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    {userPicture ? <Avatar src={userPicture} /> : <AccountCircle />}
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                  </Menu>
                </div>
              ) : (
                <Button color="inherit" onClick={() => setOpen(true)}>
                  Войти
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
        <SearchResults show={show} />
        <ModalDialog
          withActions={false}
          open={openDialog}
          onClose={closeModal}
          title={'Выберите способ авторизации'}
        >
          <AuthButtons onComplete={closeModal} />
        </ModalDialog>
      </>
    );
  }
);

export const Navigation = compose(
  connect(mapState, mapDispatch),
  withRouter
)(NavigationPC);

const useStyles = makeStyles(theme =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 'auto',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 'auto'
      },
      marginRight: '1rem'
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200
        }
      }
    }
  })
);
