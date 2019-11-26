import * as React from 'react';
import { H1, LinkButton } from 'ui/atoms';
import { useTranslation } from 'server/lib/i18n';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

type Props = {
  statusCode: number;
  err?: any;
};

const StatusCodes: React.FC<Props> = ({ statusCode }) => {
  const { t } = useTranslation();
  switch (statusCode) {
    case 404:
      return (
        <>
          <H1>{t('common:errors.404')}</H1>
          <Typography variant="subtitle1" style={{ margin: '4px auto' }}>
            {t('common:errors.404Sub')}
          </Typography>
        </>
      );

    default:
      return <H1>{t('common:errors.others')}</H1>;
  }
};

export const ErrorLayout = React.memo<Props>(({ err, statusCode }) => {
  const { t } = useTranslation();
  return (
    <Paper
      elevation={3}
      style={{ margin: '1rem', display: 'flex', flexDirection: 'column' }}
    >
      <StatusCodes statusCode={statusCode} />
      <LinkButton
        variant={'contained'}
        color="primary"
        fullWidth
        href="/"
        label={t('common:buttons.home')}
        style={{ margin: '8px auto' }}
      />
    </Paper>
  );
});
