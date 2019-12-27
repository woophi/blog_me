import * as React from 'react';
import { SocialButtons } from './SocialButtons';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export const Footer = React.memo(() => {
  const { footer } = useStyles({});
  return (
    <Box
      className={footer}
      component="footer"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      padding="2rem"
    >
      <Typography color="textSecondary" gutterBottom>
        Copyright © {new Date().getFullYear()} Red eyes blog
      </Typography>
      <SocialButtons />
    </Box>
  );
});

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: '#212121'
  }
}));
