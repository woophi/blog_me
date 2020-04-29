import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import EmailIcon from '@material-ui/icons/Email';
import { ResultSubscribe } from 'core/models';
import { ArrowTooltip } from 'ui/atoms';
import { useTranslation } from 'server/lib/i18n';
import InputLabel from '@material-ui/core/InputLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNotch,
  faExclamationTriangle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
  onSubscribe: (email: string) => Promise<ResultSubscribe>;
};

export const Subscribe: React.FC<Props> = React.memo(({ onSubscribe }) => {
  const classes = useStyles({});
  const { t } = useTranslation();
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);

  const handleCliCk = React.useCallback(() => {
    if (!value) return;
    setError('');
    setLoading(true);
    onSubscribe(value)
      .then((r) => {
        setDone(r.done);
        setError(r.error || '');
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [value]);
  return (
    <section className={classes.content}>
      <Button
        href="mailto:akaidoart@gmail.com"
        color="primary"
        variant="contained"
        className={classes.button}
      >
        {t('common:subscribe.emailBtn')}
      </Button>
      <InputLabel style={{ marginBottom: '.5rem' }}>
        {t('common:subscribe.label')}
      </InputLabel>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={t('common:subscribe.placeholder')}
          type="email"
          value={value}
          required
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="Subscribe"
          onClick={handleCliCk}
          disabled={loading}
        >
          <EmailIcon />
        </IconButton>
        {loading && (
          <Icon className={classes.statusIcon} color="primary">
            <FontAwesomeIcon icon={faCircleNotch} spin />
          </Icon>
        )}
        {error && (
          <ArrowTooltip placement="top" title={JSON.stringify(error)}>
            <Icon
              className={`${classes.statusIcon} ${classes.error}`}
              color="primary"
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </Icon>
          </ArrowTooltip>
        )}
        {done && (
          <Icon
            className={`${classes.statusIcon} ${classes.success}`}
            color="primary"
          >
            <FontAwesomeIcon icon={faCheck} />
          </Icon>
        )}
      </Paper>
    </section>
  );
});

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  button: {
    margin: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  statusIcon: {
    margin: theme.spacing(1),
    width: 'auto',
  },
  error: {
    color: theme.palette.error.main,
  },
  success: {
    color: theme.palette.primary['100'],
  },
}));
