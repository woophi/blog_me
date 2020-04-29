import * as React from 'react';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import { getFacebookPageIds } from './operations';
import { LinkButton, ArrowTooltip } from 'ui/atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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
        {pagesV.map((pv) => (
          <Box key={pv.id}>
            <ArrowTooltip placement="top" title={`Facebook страница ${pv.id}`}>
              <Icon
                color={pv.valid ? 'secondary' : 'error'}
                style={{ width: 'auto' }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </Icon>
            </ArrowTooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
});
