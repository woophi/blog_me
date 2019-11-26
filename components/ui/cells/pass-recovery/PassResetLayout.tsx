import * as React from 'react';
import { H1 } from 'ui/atoms';
import { ResetForm } from './ResetFom';

export const PassResetLayout = React.memo(() => {
  return (
    <>
      <H1 upperCase>{'Восстановить пароль'}</H1>
      <ResetForm />
    </>
  );
});
