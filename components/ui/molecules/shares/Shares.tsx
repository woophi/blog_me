import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useInterval } from 'core/lib';

let shareWindow: Window = null;

type Props = {
  linkToShare: string;
};

export const Shares = React.memo<Props>(({ linkToShare }) => {
  const { iFB, vk } = useStyles({});
  const [processing, setProcess] = React.useState(false);

  useInterval(
    () => {
      if (shareWindow && shareWindow.closed) {
        setProcess(false);
        shareWindow = null;
      }
    },
    processing ? 1000 : null
  );

  const vkShare = React.useCallback(() => {
    setProcess(true);
    if (shareWindow) {
      shareWindow.close();
    }
    shareWindow = window.open(
      `https://vk.com/share.php?url=${linkToShare}`,
      '_blank',
      'width=320px,height=540px'
    );
  }, []);
  const fbShare = React.useCallback(() => {
    setProcess(true);
    if (shareWindow) {
      shareWindow.close();
    }
    shareWindow = window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        linkToShare
      )}`,
      '_blank',
      'width=626,height=436'
    );
  }, []);
  return (
    <Box display="flex" justifyContent="center">
      <Button disabled={processing} className={vk} onClick={vkShare}>
        <Icon className={`fab fa-vk`} />
      </Button>
      <Button disabled={processing} className={iFB} onClick={fbShare}>
        <Icon className={`fab fa-facebook-square`} />
      </Button>
      {processing && <LinearProgress />}
    </Box>
  );
});

const useStyles = makeStyles(theme => ({
  iFB: {
    '&:hover': {
      color: '#4267b2'
    }
  },
  vk: {
    '&:hover': {
      color: '#5b88bd'
    }
  }
}));
