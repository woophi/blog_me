import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

type Props = {
  pristine: boolean;
  submitting: boolean;
  invalid: boolean;
  both?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  noMargin?: boolean;
};

export const ButtonsForm = React.memo<Props>(
  ({
    pristine,
    submitting,
    both = false,
    onCancel,
    submitLabel,
    noMargin = false,
    invalid,
  }) => {
    const classes = useStyles({ noMargin });
    return (
      <div className={classes.button}>
        {both && (
          <Button
            disabled={pristine || submitting}
            variant={'contained'}
            color="default"
            className={classes.cncl}
            onClick={onCancel}
          >
            отмена
          </Button>
        )}

        <Button
          type="submit"
          disabled={pristine || submitting || invalid}
          variant={'contained'}
          color="secondary"
          className={classes.sbm}
        >
          {submitting ? (
            <Icon
              color="action"
              style={{
                display: 'flex',
              }}
            >
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </Icon>
          ) : (
            submitLabel || 'отправить'
          )}
        </Button>
      </div>
    );
  }
);

const useStyles = makeStyles((theme) => ({
  button: (props: any) => ({
    margin: props.noMargin ? undefined : '0 auto 1rem',
    color: theme.palette.text.secondary,
    position: 'sticky',
    bottom: 10,
  }),
  sbm: {
    color: theme.palette.text.secondary,
  },
  cncl: {
    marginRight: '1rem',
  },
}));
