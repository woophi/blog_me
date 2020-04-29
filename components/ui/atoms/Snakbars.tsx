import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import { useInterval } from 'core/lib';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import { green, amber } from '@material-ui/core/colors';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export interface Props {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
  style?: React.CSSProperties;
  timerValue?: number;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const INITIAL_TIMER_VALUE = 2500;

export const Snakbars = React.memo<Props>((props) => {
  const classes = useStyles({});
  const { className, message, onClose, variant, style = {}, timerValue } = props;
  const [shown, show] = React.useState(true);
  const [info, setMessage] = React.useState(message);
  const [timer, setTimer] = React.useState(timerValue ?? INITIAL_TIMER_VALUE);

  React.useEffect(() => {
    setMessage(message);
    show(true);
  }, [message]);

  useInterval(
    () => {
      if (info && shown && timer > 0) {
        setTimer(timer - 1);
      }
    },
    info && shown && timer > 0 ? 1 : null
  );

  const handleClose = React.useCallback(() => {
    if (onClose) {
      onClose();
    }
    show(false);
    setMessage('');
    setTimer(timerValue ?? INITIAL_TIMER_VALUE);
  }, [onClose]);

  React.useEffect(() => {
    if (info && shown && timer <= 0) {
      handleClose();
    }
  }, [timer, shown, info, handleClose]);

  const calcValue = Number(
    ((timer / (timerValue ?? INITIAL_TIMER_VALUE)) * 100).toFixed(0)
  );

  return (
    <Snackbar
      className={className}
      style={style}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={!!info && !!shown}
    >
      <Alert severity={variant} className={classes.alertCont}>
        <div className={classes.container}>
          <span className={classes.message}>{info}</span>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleClose}
            className={classes.iconButton}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        </div>
        <Box position="absolute" bottom="0" left="0" width="100%">
          <LinearProgress
            variant="determinate"
            value={calcValue}
            color="secondary"
            className={classes[variant]}
          />
        </Box>
      </Alert>
    </Snackbar>
  );
});

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: 20,
  },
  iconButton: {
    padding: '.5rem',
    height: 36,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
  },
  alertCont: {
    position: 'relative',
    overflow: 'hidden',
    padding: '0 1rem',
    '&>.MuiAlert-icon': {
      alignSelf: 'center',
    },
  },
  success: {
    '&>.MuiLinearProgress-bar': {
      backgroundColor: green[600],
    },
  },
  error: {
    '&>.MuiLinearProgress-bar': {
      backgroundColor: theme.palette.error.main,
    },
  },
  info: {
    '&>.MuiLinearProgress-bar': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  warning: {
    '&>.MuiLinearProgress-bar': {
      backgroundColor: amber[700],
    },
  },
}));
