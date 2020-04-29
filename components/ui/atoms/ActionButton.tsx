import * as React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { ArrowTooltip } from './HtmlTooltip';
import { goToSpecific } from 'core/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNotch,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
  action: () => Promise<any>;
  label: string;
  className?: string;
  backToUrl?: string;
};

export const ActionButton = React.memo<Props>(
  ({ className = '', label, action, backToUrl = '' }) => {
    const [working, setWorking] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleClick = React.useCallback(() => {
      setWorking(true);
      action()
        .then(() => setWorking(false))
        .then(() => backToUrl && goToSpecific(backToUrl))
        .catch((e) => {
          setError(e.error || e);
          setWorking(false);
        });
    }, [action]);

    return (
      <Button
        variant={'contained'}
        color="primary"
        onClick={handleClick}
        disabled={working}
        className={className}
      >
        {working ? (
          <Icon
            color="action"
            style={{
              display: 'flex',
            }}
          >
            <FontAwesomeIcon icon={faCircleNotch} spin />
          </Icon>
        ) : (
          label
        )}
        {error && (
          <ArrowTooltip
            placement="top"
            title={error}
            style={{ marginLeft: '.5rem' }}
          >
            <Icon
              color="error"
              style={{
                display: 'flex',
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </Icon>
          </ArrowTooltip>
        )}
      </Button>
    );
  }
);
