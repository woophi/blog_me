import * as React from 'react';
import { Button, LinearProgress, Typography } from '@material-ui/core';
import { getWindow } from 'core/common';
import { checkAuth } from 'core/operations/auth';
import { useInterval } from 'core/lib';

type DialogPath = 'fb' | 'google' | 'vk';
let loginWindow: Window = null;

type GuestIdentificationWindow = {
  authLoginComplete: () => void;
} & Window &
  typeof globalThis;
const windowExt = getWindow() as GuestIdentificationWindow;

export const AuthButtons = React.memo(() => {
  const [processing, setProcess] = React.useState(false);
  const uniqRenederId = Date.now();

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

  // TODO: design buttons by rule

  return (
    <div>
      <Typography component="p">Необходимо авторизоваться</Typography>
      <div>
        <Button disabled={processing} onClick={authGoogle}>
          google
        </Button>
        <Button disabled={processing} onClick={authFb}>
          facebook
        </Button>
        <Button disabled={processing} onClick={authVk}>
          vk
        </Button>
        <LinearProgress color="secondary" hidden={!processing} />
      </div>
    </div>
  );
});
