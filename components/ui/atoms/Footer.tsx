import * as React from 'react';
import { SocialButtons } from './SocialButtons';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export const Footer = React.memo<{ version: string }>(({ version }) => {
  const { footer } = useStyles({});

  const showVersion = version ? `v${version}` : null;

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
        Copyright © 2019-{new Date().getFullYear()} Red eyes blog {showVersion}
      </Typography>
      <SocialButtons />
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#212121',
  },
}));
