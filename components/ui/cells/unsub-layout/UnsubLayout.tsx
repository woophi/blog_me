import * as React from 'react';
import { H1, Spinner, ActionButton } from 'ui/atoms';
import { useTranslation } from 'server/lib/i18n';
import { getUnsubLinkState, guestUnsub } from 'core/operations';
import { LinkState } from 'core/models';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

type Props = {
  uniqId: string;
};

export const UnsubLayout = React.memo<Props>(({ uniqId }) => {
  const { t } = useTranslation();
  const [unsubState, setUnsubState] = React.useState(LinkState.FETCHING);
  const [thx, setThx] = React.useState(false);

  React.useEffect(() => {
    setUnsubState(LinkState.FETCHING);
    getUnsubLinkState(uniqId)
      .then(setUnsubState)
      .catch(setUnsubState);
  }, [uniqId]);

  const unsub = React.useCallback(
    () =>
      guestUnsub(uniqId).finally(() => {
        setThx(true);
      }),
    [uniqId]
  );

  return (
    <>
      <H1 upperCase>{t('common:unsub.title')}</H1>
      <Box display="flex" flexDirection="column" margin="1rem auto" maxWidth="576px">
        {unsubState === LinkState.INVALID && !thx && (
          <Typography variant="h6" gutterBottom style={{ margin: '1rem' }}>
            {t('common:unsub.invalid')}
          </Typography>
        )}
        {unsubState === LinkState.VALID && !thx && (
          <>
            <Typography variant="h6" gutterBottom style={{ margin: '1rem' }}>
              {t('common:unsub.content')}
            </Typography>
            <Box alignSelf="center">
              <ActionButton label={t('common:buttons.unsub')} action={unsub} />
            </Box>
          </>
        )}
        {thx && (
          <Typography variant="h6" gutterBottom style={{ margin: '1rem' }}>
            {t('common:unsub.verySorry')}
          </Typography>
        )}
      </Box>
      <Spinner isShow={unsubState === LinkState.FETCHING} />
    </>
  );
});
