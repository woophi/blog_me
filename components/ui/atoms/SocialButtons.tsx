import * as React from 'react';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(1),
    width: 'auto',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  iFB: {
    '&:hover': {
      color: '#4267b2'
    }
  },
  iSkype: {
    '&:hover': {
      color: '#0078ca'
    }
  },
  vk: {
    '&:hover': {
      color: '#5b88bd'
    }
  },
  ig: {
    '&:hover': {
      color: '#000'
    }
  },
  ytube: {
    '&:hover': {
      color: '#dd2c00'
    }
  },
  tg: {
    '&:hover': {
      color: '#0088cc'
    }
  }
}));

export const SocialButtons: React.FC = React.memo(() => {
  const classes = useStyles({});

  return (
    <div>
      <Link
        component="a"
        variant="body2"
        href="https://vk.com/space_goose"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, 'fab fa-vk', classes.vk)}
          color="primary"
        />
      </Link>
      <Link
        component="a"
        variant="body2"
        href="https://www.instagram.com/red_eyes_me"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, 'fab fa-instagram', classes.ig)}
          color="primary"
        />
      </Link>
      <Link
        component="a"
        variant="body2"
        href="https://t.me/redeyesme"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, 'fab fa-telegram', classes.tg)}
          color="primary"
        />
      </Link>
    </div>
  );
})
