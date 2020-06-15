import * as React from 'react';
import { H1 } from 'ui/atoms/H1';
import { ResetForm } from './ResetFom';
import Box from '@material-ui/core/Box';

export const PassResetLayout = React.memo(() => {
  return (
    <>
      <Box display="flex" justifyContent="center">
        <H1 upperCase>{'Восстановить пароль'}</H1>
      </Box>
      <ResetForm />
    </>
  );
});
