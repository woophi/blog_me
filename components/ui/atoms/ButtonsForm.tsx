import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTranslation } from 'server/lib/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

type Props = {
  pristine: boolean;
  submitting: boolean;
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
  }) => {
    const classes = useStyles({ noMargin });
    const { t } = useTranslation();
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
            {t('common:buttons.cancel')}
          </Button>
        )}

        <Button
          type="submit"
          disabled={pristine || submitting}
          variant={'contained'}
          color="secondary"
          className={classes.sbm}
        >
          {submitting ? (
            <Icon
              color="action"
              style={{
                display: 'flex'
              }}
            >
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </Icon>
          ) : (
            t(submitLabel || 'common:buttons.send')
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
  }),
  sbm: {
    color: theme.palette.text.secondary,
  },
  cncl: {
    marginRight: '1rem',
  },
}));
