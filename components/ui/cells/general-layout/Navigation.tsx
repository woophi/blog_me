import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
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
  processing: state.ui.searchStatus !== SearchStatus.init
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
  ({ router, processing, query, search }) => {
    const [show, setShow] = React.useState(false);
    const classes = useStyles({});
    const goHome = React.useCallback(() => {
      goToSpecific('/');
    }, []);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        search(e.target.value);
      },
      [search]
    );

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
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
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
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
        <SearchResults show={show} />
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
      }
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
