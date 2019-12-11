import * as React from 'react';
import { Button } from '@material-ui/core';
import { getWindow } from 'core/common';
import { checkAuth } from 'core/operations/auth';

type DialogPath = 'fb' | 'google' | 'vk';
let loginWindow: Window = null;

type GuestIdentificationWindow = {
  authLoginComplete: () => void;
} & Window &
  typeof globalThis;
const windowExt = getWindow() as GuestIdentificationWindow;
windowExt
  ? (windowExt.authLoginComplete = () => {
      if (loginWindow) {
        loginWindow.close();
        loginWindow = null;
      }
      checkAuth();
    })
  : null;

export const AuthButtons = React.memo(() => {
  const uniqRenederId = Date.now();

  const openDialog = React.useCallback(
    (path: DialogPath) => {
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

  return (
    <div>
      <Button onClick={authGoogle}>google</Button>
    </div>
  );
});
