import { Box, Typography } from '@material-ui/core';
import { SeasonInfo } from 'core/models/admin';
import Router from 'next/router';
import { FC } from 'react';
import { ActionButton } from 'ui/atoms/ActionButton';
import { startSeason, stopSeason, putSeasonParticipants } from '../operations';

export const SeasonDetail: FC<{ seasonInfo?: SeasonInfo }> = ({
  seasonInfo = {} as SeasonInfo,
}) => {
  return (
    <Box margin="1rem">
      <ActionButton
        label={seasonInfo.run ? 'стоп сезон' : 'старт сезона'}
        action={() =>
          seasonInfo.run
            ? stopSeason().then(() => Router.reload())
            : startSeason().then(() => Router.reload())
        }
      />
      <Box marginTop="1rem">
        <Typography color="secondary" gutterBottom>
          Цифры
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Всего участников сезона - {seasonInfo.participantsCount}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Всего опросов - {seasonInfo.allQuizCount}
        </Typography>
        <ActionButton
          label={'положить участников'}
          action={() => putSeasonParticipants().then(() => Router.reload())}
        />
      </Box>
    </Box>
  );
};
