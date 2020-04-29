import * as React from 'react';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVk, faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons';

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
        href="https://vk.com/id0"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, classes.vk)}
          color="primary"
        >
          <FontAwesomeIcon icon={faVk} />
        </Icon>
      </Link>
      <Link
        component="a"
        variant="body2"
        href="https://www.instagram.com/red_eyes_me"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, classes.ig)}
          color="primary"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </Icon>
      </Link>
      <Link
        component="a"
        variant="body2"
        href="https://t.me/redeyesme"
        target="_blank"
      >
        <Icon
          className={clsx(classes.icon, classes.tg)}
          color="primary"
        >
          <FontAwesomeIcon icon={faTelegram} />
        </Icon>
      </Link>
    </div>
  );
})
