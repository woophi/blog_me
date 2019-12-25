import * as React from 'react';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import { getFacebookPageIds, checkTokenValidation } from './operations';
import { LinkButton, ArrowTooltip } from 'ui/atoms';

export const AdminFacebook = React.memo(() => {
  const [pagesV, setPagesV] = React.useState<{ id: number; valid: Boolean }[]>([]);

  React.useEffect(() => {
    getFacebookPageIds().then(setPagesV);
  }, []);

  return (
    <Box flexDirection="column" flex={1}>
      <Box display="flex" alignItems="center">
        <LinkButton
          href={'/setup/fb'}
          label={'Добавить facebook страницы'}
          variant="contained"
          color="primary"
        />
        {pagesV.map(pv => (
          <Box key={pv.id}>
            <ArrowTooltip placement="top" title={`Facebook страница ${pv.id}`}>
              <Icon
                className={`fas fa-check`}
                color={pv.valid ? 'secondary' : 'error'}
                style={{ width: 'auto' }}
              />
            </ArrowTooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
});
