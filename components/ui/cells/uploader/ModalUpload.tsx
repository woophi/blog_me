import * as React from 'react';
import { ModalDialog } from 'ui/atoms';
import { PaperDropzone } from './Uploader';
import Box from '@material-ui/core/Box';
import { FilesList } from './FileList';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalUpload = React.memo<Props>(({
  open, onClose, onConfirm
}) => {
  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={'Выберете файл или загрузите новый'}
      confirmTitle={'Выбрать'}
    >
      <Box flex={1} height={500} display="flex" flexWrap="wrap">
        <Box minWidth={250} minHeight={250}>
          <FilesList />
        </Box>
        <PaperDropzone />
      </Box>
    </ModalDialog>
  );
});
