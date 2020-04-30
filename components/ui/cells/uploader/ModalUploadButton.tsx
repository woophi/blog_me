import * as React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { ArrowTooltip } from 'ui/atoms';
import { FieldInputProps } from 'react-final-form';
import Paper from '@material-ui/core/Paper';
import { deselectFile, getChosenFile } from './operations';
import { connect } from 'react-redux';
import { AppState } from 'core/models';
import { getSelectedFile } from 'core/selectors';
import { FileItem } from 'core/models/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ModalUpload as ModalUploadPC } from './ModalUpload';

type OwnProps = {
  label?: string;
  error?: any;
  disabled?: boolean;
  input?: FieldInputProps<any, HTMLButtonElement>;
  className?: string;
  inputLabel?: string;
};

type Props = {
  file: FileItem;
  chosenFile: FileItem;
} & OwnProps;

const ModalUploadComponent = React.memo<Props>(
  ({
    label = 'Выбрать файл',
    error,
    disabled = false,
    input,
    file,
    chosenFile,
    className = '',
    inputLabel = '',
  }) => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClickClose = () => {
      setOpen(false);
      deselectFile();
    };

    const handleConfirm = () => {
      setOpen(false);
      if (input) {
        input.onChange(file._id);
      }
    };

    return (
      <div className={className}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          disabled={disabled}
          onFocus={input && input.onFocus}
          onBlur={input && input.onBlur}
        >
          {chosenFile._id ? 'Файл выбран' : label}
          {error && (
            <ArrowTooltip
              placement="top"
              title={error}
              style={{ marginLeft: '.5rem' }}
            >
              <Icon color="error" style={{ width: 'auto' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </Icon>
            </ArrowTooltip>
          )}
        </Button>
        {chosenFile.url && (
          <Paper
            elevation={4}
            style={{ minWidth: 288, height: 320, marginTop: '.5rem', maxWidth: 320 }}
          >
            <img
              src={chosenFile.url}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
            />
          </Paper>
        )}
        <ModalUploadPC
          onClose={handleClickClose}
          onConfirm={handleConfirm}
          open={open}
        />
      </div>
    );
  }
);

export const ModalUploadButton = connect((state: AppState, props: OwnProps) => ({
  file: getSelectedFile(state),
  chosenFile: getChosenFile(props.input && props.input.value),
}))(ModalUploadComponent);
