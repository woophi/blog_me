import * as React from 'react';
import { Button, LinearProgress, Typography, makeStyles } from '@material-ui/core';
import { getWindow } from 'core/common';
import { checkAuth } from 'core/operations/auth';
import { useInterval } from 'core/lib';
import { LinkButton } from 'ui/atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faVk } from '@fortawesome/free-brands-svg-icons';

type Props = {
  onComplete?: () => void
}

type DialogPath = 'fb' | 'google' | 'vk';
let loginWindow: Window = null;

type GuestIdentificationWindow = {
  authLoginComplete: () => void;
} & Window &
  typeof globalThis;
const windowExt = getWindow() as GuestIdentificationWindow;

export const AuthButtons = React.memo<Props>(({ onComplete }) => {
  const [processing, setProcess] = React.useState(false);
  const uniqRenederId = Date.now();

  const { googleBtn, facebookBtn } = useStyles({});

  useInterval(
    () => {
      if (loginWindow && loginWindow.closed) {
        setProcess(false);
        loginWindow = null;
      }
    },
    processing ? 200 : null
  );

  React.useEffect(() => {
    windowExt
      ? (windowExt.authLoginComplete = () => {
          setProcess(false);
          if (loginWindow) {
            loginWindow.close();
            loginWindow = null;
          }
          checkAuth();
          if (onComplete) {
            onComplete();
          }
        })
      : null;
  }, [windowExt]);

  const openDialog = React.useCallback(
    (path: DialogPath) => {
      setProcess(true);
      loginWindow = windowExt
        ? windowExt.open(
            `/auth/${path}/go?windowId=${uniqRenederId}`,
            '_blank',
            'width=320,height=570'
          )
        : null;
    },
    [windowExt]
  );

  const authGoogle = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      openDialog('google');
    },
    []
  );
  const authFb = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      openDialog('fb');
    },
    []
  );
  const authVk = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      openDialog('vk');
    },
    []
  );

  return (
    <div>
      <div>
        <button className={googleBtn} disabled={processing} onClick={authGoogle}>
          <img src="/img/google.svg" />
          <Typography gutterBottom>Войти с Google</Typography>
        </button>
        <button className={facebookBtn} disabled={processing} onClick={authFb}>
          <FontAwesomeIcon icon={faFacebook} />
          <Typography>Войти с Facebook</Typography>
        </button>
        <Button disabled={processing} onClick={authVk}>
          <FontAwesomeIcon icon={faVk} size="2x" />
        </Button>
        <LinearProgress color="secondary" hidden={!processing} />
      </div>
      <LinkButton
        href="/privacy-policy"
        color="secondary"
        variant="outlined"
        label="Privacy policy"
      />
    </div>
  );
});

const useStyles = makeStyles(theme => ({
  googleBtn: {
    ...commonStyle(),
    backgroundColor: '#4285F4',
    borderRadius: '2px',
    '&>img': {
      position: 'relative',
      top: -3,
      left: -3,
      marginRight: '6px'
    },
    '&>div': {
      fontSize: '14px',
      margin: 'auto'
    }
  },
  facebookBtn: {
    ...commonStyle(),
    backgroundColor: '#1877f2',
    borderRadius: '4px',
    '&>svg': {
      fontSize: 28,
      marginRight: '8px',
      marginLeft: '.5rem'
    },
    '&>div': {
      lineHeight: '1.4rem',
      margin: 'auto'
    }
  }
}));

const commonStyle = () => ({
  padding: '0 .5rem 0 0',
  height: 40,
  maxWidth: 400,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '.5rem',
  cursor: 'pointer',
  boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.24), 0px 0px 1px rgba(0, 0, 0, 0.12)',
  transform: 'translateY(0)',
  transition: '.2s ease',
  outline: 'none !important',
  border: 'none',
  '&:active:not(:disabled)': {
    boxShadow: 'unset',
    transform: 'translateY(1px)'
  },
  '&:hover': {
    boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.4)'
  },
  '&:disabled': {
    cursor: 'not-allowed'
  }
});
