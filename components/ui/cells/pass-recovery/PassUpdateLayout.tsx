import * as React from 'react';
import { H1, Spinner } from 'ui/atoms';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { LinkState } from 'core/models';
import { getResetPassLinkState } from 'core/operations';
import { UpdateForm } from './UpdateForm';
import { useTranslation } from 'server/lib/i18n';

type Props = {
  linkId: string;
}

export const PassUpdateLayout = React.memo<Props>(({ linkId }) => {
  const [unsubState, setUnsubState] = React.useState(LinkState.FETCHING);
  const { t } = useTranslation();

  React.useEffect(() => {
    setUnsubState(LinkState.FETCHING);
    getResetPassLinkState(linkId)
      .then(setUnsubState)
      .catch(setUnsubState);
  }, [linkId]);

  return (
    <>
      <H1 upperCase>{'Обновление пароля'}</H1>

      <Box display="flex" flexDirection="column" margin="1rem auto">
        {unsubState === LinkState.INVALID && (
          <Typography variant="h6" gutterBottom style={{ margin: '1rem' }}>
            {t('common:unsub.invalid')}
          </Typography>
        )}
        {unsubState === LinkState.VALID && (
          <UpdateForm linkId={linkId} />
        )}
      </Box>
      <Spinner isShow={unsubState === LinkState.FETCHING} />
    </>
  );
});
