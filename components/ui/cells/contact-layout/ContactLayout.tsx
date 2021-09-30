import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { H1 } from 'ui/atoms/H1';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import { ContactForm } from './ContactForm';
import { useTranslation } from 'next-i18next';
import Box from '@material-ui/core/Box';

export const ContactLayout: React.FC = React.memo(() => {
  const classes = useStyles({});
  const { t } = useTranslation();
  return (
    <>
      <Box display="flex" flexDirection="column">
        <H1 upperCase>{t('common:contact.title')}</H1>
        <Typography className={classes.m} variant="button" display="block" gutterBottom>
          {t('common:contact.orders')}
        </Typography>
        <Link component="a" variant="body2" href="mailto:attendentofsky@gmail.com" target="_blank" className={classes.m}>
          <Typography variant="button" display="block" gutterBottom className={classes.text}>
            <Icon style={{ width: 30 }} className={'fas fa-envelope'} color="primary" />
            <span>{'attendentofsky@gmail.com'}</span>
          </Typography>
        </Link>
      </Box>
      <ContactForm />
    </>
  );
});

const useStyles = makeStyles(theme => ({
  m: {
    margin: '0 auto 1rem'
  },
  text: {
    display: 'flex',
    justifyContent: 'space-evnly'
  }
}));
