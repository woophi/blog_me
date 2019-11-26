import * as React from 'react';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(1),
    width: 30,
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
  }
}));

export const SocialButtons: React.FC = React.memo(() => {
  const classes = useStyles({});

  return (
    <div>
      <Link
        component="a"
        variant="body2"
        href="https://www.facebook.com/furman2012"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, 'fab fa-facebook-square', classes.iFB)}
          color="primary"
        />
      </Link>

      <Link
        component="a"
        variant="body2"
        href="skype:live:bd37f9fda1ce6827?call"
      >
        <Icon
          className={clsx(classes.icon, 'fab fa-skype', classes.iSkype)}
          color="primary"
        />
      </Link>
      <Link
        component="a"
        variant="body2"
        href="https://vk.com/id183126454"
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
        href="https://www.instagram.com/akaidoart"
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
        href="https://www.youtube.com/channel/UCAkXly2PfDr412tYnNZHq3g"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, 'fab fa-youtube', classes.ytube)}
          color="primary"
        />
      </Link>
    </div>
  )
})
