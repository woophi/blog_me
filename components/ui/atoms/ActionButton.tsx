import * as React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { ArrowTooltip } from './HtmlTooltip';
import { goToSpecific } from 'core/common';

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
        .catch(e => {
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
            className={`fas fa-circle-notch fa-spin`}
            color="action"
            style={{
              margin: 'auto'
            }}
          />
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
              className={'fas fa-exclamation-triangle'}
              color="error"
              style={{ width: 'auto' }}
            />
          </ArrowTooltip>
        )}
      </Button>
    );
  }
);
