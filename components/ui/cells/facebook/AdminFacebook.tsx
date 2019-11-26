import * as React from 'react';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import { getFacebookPageIds, checkTokenValidation } from './operations';
import { LinkButton, ArrowTooltip, Spinner } from 'ui/atoms';

export const AdminFacebook = React.memo(() => {
  const [pages, setPages] = React.useState([]);
  const [valid, setValid] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    getFacebookPageIds().then(setPages);
  }, []);

  React.useEffect(() => {
    if (pages.length === 1) {
      checkTokenValidation(pages[0]).then(setValid)
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
    } else {
      setFetching(false);
    }
  }, [pages]);

  return (
    <Box flexDirection="column" flex={1}>
      <Box display="flex" alignItems="center">
        <LinkButton
          href={'/setup/fb'}
          disabled={!!(pages.length && valid)}
          label={'Добавить facebook страницу'}
          variant="contained"
          color="primary"
        />
        <Box>
          {!valid && (
            <ArrowTooltip
              placement="top"
              title={'Сайт не может получить доступ к facebook странице'}
            >
              <Icon
                className={`fas fa-exclamation-triangle`}
                color="error"
                style={{ width: 'auto' }}
              />
            </ArrowTooltip>
          )}
          {valid && (
            <ArrowTooltip placement="top" title={'Facebook страница добавлена'}>
              <Icon
                className={`fas fa-check`}
                color="primary"
                style={{ width: 'auto' }}
              />
            </ArrowTooltip>
          )}
        </Box>
      </Box>
      <Spinner isShow={fetching} />
    </Box>
  );
});
