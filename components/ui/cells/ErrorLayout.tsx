import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { H1 } from 'ui/atoms/H1';
import { LinkButton } from 'ui/atoms/Links';

type Props = {
  statusCode: number;
  err?: any;
};

const StatusCodes: React.FC<Props> = ({ statusCode }) => {
  switch (statusCode) {
    case 404:
      return (
        <>
          <H1>Страница не найдена</H1>
          <Typography variant="subtitle1" style={{ margin: '4px auto' }}>
            По Вашему запросу мы не смогли ничего найти.
          </Typography>
        </>
      );

    default:
      return <H1>Упс... что-то пошло не так...</H1>;
  }
};

export const ErrorLayout = React.memo<Props>(({ err, statusCode }) => {
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
        label="На главную"
        style={{ margin: '8px auto' }}
      />
    </Paper>
  );
});
