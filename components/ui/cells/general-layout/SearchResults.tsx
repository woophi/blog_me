import * as React from 'react';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core';

type Props = {
  show: boolean;
};

export const SearchResults = React.memo<Props>(({ show }) => {
  const { boxBg } = useStyles({});
  return (
    <Fade in={show}>
      <Box
        width="100%"
        height="100vh"
        position="absolute"
        zIndex={3}
        className={boxBg}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        kekw
      </Box>
    </Fade>
  );
});

const useStyles = makeStyles(theme => ({
  boxBg: {
    backgroundColor: theme.palette.background.paper
  }
}));
