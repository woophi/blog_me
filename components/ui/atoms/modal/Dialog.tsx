import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  confirmTitle?: string;
  children?: React.ReactNode;
};

export const ModalDialog = React.memo<Props>(
  ({
    open = false,
    onClose,
    onConfirm,
    children,
    title,
    confirmTitle = 'Добавить'
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            margin: '1rem'
          }
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            {'Отмена'}
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained">
            {confirmTitle}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
