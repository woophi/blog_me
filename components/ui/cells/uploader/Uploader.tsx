import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { AppState } from 'core/models';
import { getSelectedFile, getAdminState, getFailedState } from 'core/selectors';
import { Spinner, Snakbars } from 'ui/atoms';
import { uploadFile, failedFalse } from './operations';
import Button from '@material-ui/core/Button';
import { theme } from 'core/lib';
import { allowedFormats } from 'core/common';
import Box from '@material-ui/core/Box';
import { FileItem } from 'core/models/admin';

type Props = {
  file: FileItem;
  uploading: boolean;
  uploadFailed: boolean;
};
const PaperDropzoneComponent = React.memo<Props>(
  ({ file, uploading, uploadFailed }) => {
    const onDrop = React.useCallback((acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length) {
        uploadFile(acceptedFiles);
      }
    }, []);
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      onDrop,
      accept: allowedFormats,
      multiple: false,
    });
    const { ref, ...rootProps } = getRootProps();
    return (
      <>
        <Snakbars
          variant="error"
          message={uploadFailed ? 'Failed to upload' : null}
          onClose={failedFalse}
        />
        <RootRef rootRef={ref}>
          <Paper
            {...rootProps}
            style={{
              marginLeft: '1rem',
              width: 230,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isDragActive && (
              <Box
                position="absolute"
                display="flex"
                height="100%"
                width="100%"
                zIndex={1}
                style={{
                  backgroundColor: 'rgba(169, 164, 164, 0.29)',
                }}
              >
                <Paper
                  style={{
                    backgroundColor: theme.palette.primary['100'],
                    margin: 'auto',
                    height: 'min-content',
                    padding: '0 1rem',
                  }}
                >
                  <p>{'Отпустите файл'}</p>
                </Paper>
              </Box>
            )}
            {isDragReject && (
              <Box
                position="absolute"
                display="flex"
                height="100%"
                width="100%"
                zIndex={1}
                style={{
                  backgroundColor: 'rgba(169, 164, 164, 0.29)',
                }}
              >
                <Paper
                  style={{
                    backgroundColor: theme.palette.error.main,
                    margin: 'auto',
                    height: 'min-content',
                    padding: '0 1rem',
                  }}
                >
                  <p>{'Недопустимый формат'}</p>
                </Paper>
              </Box>
            )}
            <input {...getInputProps({ disabled: uploading })} />
            <Button onClick={(e) => e.preventDefault()} variant="contained">
              {'Згрузить файл'}
            </Button>
            {uploading && <p>Uploading...</p>}
            <img
              src={file.url}
              style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto' }}
            />
          </Paper>
        </RootRef>
        <Spinner isShow={uploading} />
      </>
    );
  }
);

export const PaperDropzone = connect((state: AppState) => ({
  file: getSelectedFile(state),
  uploadFailed: getFailedState(state),
  uploading: getAdminState(state).uploadingFile,
}))(PaperDropzoneComponent);
