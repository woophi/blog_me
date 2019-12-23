import * as React from 'react';
import { LinkButton } from 'ui/atoms';
import { LoginForm } from './LoginForm';
import Box from '@material-ui/core/Box';

export const LoginLayout = React.memo(() => {
  return (
    <Box>
      <Box margin="0 auto">
        <LinkButton href="/password/reset" label="Восстановить пароль" />
      </Box>
      <LoginForm />
    </Box>
  );
});
