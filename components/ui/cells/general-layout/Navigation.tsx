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

const NavigationPC = React.memo<WithRouterProps>(({ router }) => {
  const goHome = React.useCallback(() => {
    goToSpecific('/');
  }, []);

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
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
});

export const Navigation = withRouter(NavigationPC);
