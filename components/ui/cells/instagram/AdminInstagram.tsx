import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { askIgLogin, sendIgCode } from './operations';
import Fade from '@material-ui/core/Fade';
import { theme } from 'core/lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ArrowTooltip } from 'ui/atoms/HtmlTooltip';
import { Spinner } from 'ui/atoms/spinner';
import { TextField } from 'ui/atoms/TextField';

export const AdminInstagram = React.memo(() => {
  const [open, setOpen] = React.useState(false);
  const [valid, setValid] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const [value, change] = React.useState('');

  const handleAsk = React.useCallback(() => {
    setFetching(true);
    askIgLogin()
      .then((r) => (!r ? setOpen(true) : setValid(true)))
      .finally(() => setFetching(false));
  }, []);

  const handleSendCode = React.useCallback(() => {
    setFetching(true);
    sendIgCode(Number(value))
      .then((r) => setValid(r))
      .finally(() => setFetching(false));
  }, [value]);

  return (
    <Box flexDirection="column" flex={1}>
      <Box display="flex" alignItems="center" margin="1rem">
        <Button
          disabled={fetching || open}
          variant="contained"
          color="primary"
          onClick={handleAsk}
        >
          {'Проверить instagram авторизацию'}
        </Button>
        <Box>
          {valid && (
            <ArrowTooltip placement="top" title={'Сайт получил доступ к Instagram'}>
              <Icon
                color="primary"
                style={{
                  width: 'auto',
                  marginLeft: '1rem',
                  color: theme.palette.primary['100'],
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </Icon>
            </ArrowTooltip>
          )}
        </Box>
      </Box>
      <Fade in={open && !valid}>
        <Box display="flex" margin="1rem">
          <TextField
            label={'Введите sms код'}
            type="number"
            required
            variant="standard"
            disabled={fetching}
            value={value}
            onChange={(e) => change(e.target.value)}
          />
          <Button
            disabled={fetching || !value}
            color="primary"
            onClick={handleSendCode}
            variant="contained"
          >
            {'Отправить код'}
          </Button>
        </Box>
      </Fade>
      <Spinner isShow={fetching} />
    </Box>
  );
});
