import * as React from 'react';
import {
  withStyles,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import Router from 'next/router';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as constants from './constants';

const StyledBreadcrumb = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: 24,
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:active': {
      boxShadow: theme.shadows[1],
    },
  },
}))(Chip) as typeof Chip;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      backgroundColor: 'transparent',
    },
  })
);

export const Bread: React.FC = () => {
  const classes = useStyles({});

  const routes = Router.route.split('/');
  const restRoutes = routes.filter((r) => r !== 'admin');
  return (
    <Paper elevation={0} className={classes.root}>
      <Breadcrumbs
        separator={<NavigateNextIcon color="primary" fontSize="small" />}
        aria-label="breadcrumb"
      >
        <StyledBreadcrumb label="Главная" onClick={constants.toHome} />
        <StyledBreadcrumb label="Админ" onClick={constants.toAdmin} />
        {restRoutes.length && !!restRoutes.join('/') && (
          <SpecificRoute currentRoute={restRoutes.join('/')} />
        )}
      </Breadcrumbs>
    </Paper>
  );
};

type SpecificRouteProps = {
  currentRoute: string;
};

const SpecificRoute: React.FC<SpecificRouteProps> = ({ currentRoute }) => {
  if (currentRoute.indexOf('blog') !== -1) {
    return <StyledBreadcrumb label={'Блоги'} onClick={constants.toBlogs} />;
  }
  if (currentRoute.indexOf('comment') !== -1) {
    return <StyledBreadcrumb label={'Комментарии'} onClick={constants.toComments} />;
  }
  if (currentRoute.indexOf('user') !== -1) {
    return <StyledBreadcrumb label={'Пользователи'} onClick={constants.toUsers} />;
  }
  if (currentRoute.indexOf('ban') !== -1) {
    return <StyledBreadcrumb label={'Бан'} onClick={constants.toBans} />;
  }
  if (currentRoute.indexOf('quizzes') !== -1) {
    return <StyledBreadcrumb label={'Quizzes'} onClick={constants.toQuizzes} />;
  }
  return null;
};
