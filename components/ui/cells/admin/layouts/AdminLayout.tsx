import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { connect as redux } from 'react-redux';
import { AppState } from 'core/models';
import { getUserFetching, getUserId } from 'core/selectors';
import { drawerWidth } from '../constants';
import { AdminMenu } from '../Menu';
import { Spinner } from 'ui/atoms/spinner';
import { Bread } from 'ui/atoms/Bread';
import { ScrollButton } from 'ui/atoms/ScrollToTop';

type Props = {
  fetching: boolean;
  userId: string;
};

const AdminLayoutComponent = React.memo<Props>(({ children, fetching, userId }) => {
  const classes = useStyles({});
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  if (fetching || !userId) {
    return <Spinner />;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {'Администрирование'}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            <AdminMenu />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            <AdminMenu />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Bread />
        {children}
        <ScrollButton position={'right'} />
      </main>
    </div>
  );
});

export const AdminLayout = redux((state: AppState) => ({
  fetching: getUserFetching(state),
  userId: getUserId(state)
}))(AdminLayoutComponent);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      paddingTop: '4rem',
      flexDirection: 'column'
    }
  })
);
