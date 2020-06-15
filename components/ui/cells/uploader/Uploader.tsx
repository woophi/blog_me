import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { AppState } from 'core/models';
import { getSelectedFile, getAdminState, getFailedState } from 'core/selectors';
import { uploadFile, failedFalse, uploadFileUrl } from './operations';
import Button from '@material-ui/core/Button';
import { theme } from 'core/lib';
import { allowedFormats } from 'core/common';
import Box from '@material-ui/core/Box';
import { FileItem } from 'core/models/admin';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TextField } from 'ui/atoms/TextField';
import { Snakbars } from 'ui/atoms/Snakbars';
import { TabPanel } from 'ui/atoms/TabPanel';
import { Spinner } from 'ui/atoms/spinner';

type Props = {
  file: FileItem;
  uploading: boolean;
  uploadFailed: boolean;
};
const PaperDropzoneComponent = React.memo<Props>(
  ({ file, uploading, uploadFailed }) => {
    const [tabValue, setTabValue] = React.useState(0);
    const [url, setUrl] = React.useState('');

    const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
      setTabValue(newValue);
    };
    const onDrop = React.useCallback((acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length) {
        uploadFile(acceptedFiles);
      }
    }, []);

    const changeUrl = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value)
    }, []);

    const uploadUrlFile = React.useCallback(() => {
      uploadFileUrl(url);
    }, [url]);
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
        <Box padding="1rem">
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              centered
            >
              <Tab label="Files" />
              <Tab label="Url" />
            </Tabs>
          </Paper>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <RootRef rootRef={ref}>
            <Paper
              {...rootProps}
              style={{
                maxWidth: 250,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
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
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <TextField onChange={changeUrl} value={url} />
            <Button onClick={uploadUrlFile} variant="contained">
              {'Згрузить URL файл'}
            </Button>
          </Box>
        </TabPanel>
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
