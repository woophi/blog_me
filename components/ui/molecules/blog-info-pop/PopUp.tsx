import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ShareIcon from '@material-ui/icons/Share';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import FacebookIcon from '@material-ui/icons/Facebook';
import { useInterval } from 'core/lib';

type Props = {
  value: number;
  linkToShare: string;
  scrollToElement: () => void;
};

let shareWindow: Window = null;

export const PopUp = React.memo<Props>(({ value, linkToShare, scrollToElement }) => {
  const [show, setShow] = React.useState(false);
  const classes = useStyles({});
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

  const toggleShow = React.useCallback(() => {
    setShow(!show);
  }, [show]);
  const hide = React.useCallback(() => {
    setShow(false);
  }, []);
  return (
    <Slide direction="up" in={value !== null} onExiting={hide} timeout={500}>
      <Box position="fixed" zIndex={1} bottom="0" width="100%" maxWidth="400px">
        <Slide direction="up" in={show} timeout={500}>
          <Box
            border={1}
            borderColor="secondary.main"
            borderBottom={0}
            className={classes.paper}
            height="50px"
            display="flex"
            justifyContent="center"
          >
            <IconButton color="secondary" onClick={fbShare}>
              <FacebookIcon />
            </IconButton>
            <IconButton color="secondary" onClick={vkShare}>
              <Icon color="secondary" className={`fab fa-vk`} />
            </IconButton>
          </Box>
        </Slide>
        <Box
          position="relative"
          zIndex={2}
          className={classes.paper}
          border={1}
          borderColor="secondary.main"
          borderBottom={0}
          display="flex"
        >
          <Box width="100%">
            <Button
              style={{
                height: '50px'
              }}
              color="secondary"
              fullWidth
              onClick={toggleShow}
            >
              <ShareIcon />
            </Button>
          </Box>
          <Box width="100%">
            <Button
              style={{
                height: '50px'
              }}
              color="secondary"
              fullWidth
              onClick={scrollToElement}
            >
              <OutdoorGrillIcon />
            </Button>
          </Box>
        </Box>
        <Box position="relative" zIndex={2} border={1} borderColor="secondary.main">
          <LinearProgress variant="determinate" value={value} color="secondary" />
        </Box>
      </Box>
    </Slide>
  );
});

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    margin: theme.spacing(1),
    width: 30,
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));
