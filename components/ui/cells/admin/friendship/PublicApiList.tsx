import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import { PublicApiItem, PublicApiPayload, PublicApiScope } from 'core/models/admin';
import moment from 'moment';
import React, { Fragment, memo, useCallback, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { ActionButton } from 'ui/atoms/ActionButton';
import { styleTruncate } from 'ui/atoms/constants';
import { ModalDialog } from 'ui/atoms/modal';
import { createPublicApi, deletePublicApi, getPublicApiList } from './operations';

export const PublicApiList = memo(() => {
  const [list, setList] = useState<PublicApiItem[]>([]);
  const [data, setData] = useState<PublicApiPayload>({
    appId: 0,
    name: '',
    scope: PublicApiScope.PaidSub,
  });
  const [open, setOpen] = useState(false);

  const loadList = useCallback(() => getPublicApiList().then(setList), []);
  const onConfirm = () => {
    createPublicApi(data).then(loadList);
  };
  const handleDelete = (appId: number) => {
    deletePublicApi(appId).then(loadList);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((d) => ({
      ...d,
      [name]: value,
    }));
  };
  return (
    <Box width="100%">
      <Box margin="1rem">
        <ActionButton label={'Public apis'} action={loadList} fetchOnMount />
      </Box>
      <Box margin="1rem">
        <Button onClick={handleOpenModal}>Create public api</Button>
      </Box>
      <Box width="100%" height="300px">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              itemData={{
                list,
                handleDelete,
              }}
              height={height}
              width={width}
              itemSize={46}
              itemCount={list.length}
              style={{
                overflowX: 'hidden',
              }}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
      <ModalDialog
        open={open}
        onClose={handleCloseModal}
        title="Create Public Api"
        onConfirm={onConfirm}
      >
        <form noValidate autoComplete="off">
          <TextField
            label="App Id"
            value={data.appId}
            name="appId"
            type="number"
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Name"
            value={data.name}
            name="name"
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Scope"
            value={data.scope}
            name="scope"
            onChange={handleChange}
            variant="outlined"
          />
        </form>
      </ModalDialog>
    </Box>
  );
});
type Props = {
  list: PublicApiItem[];
  handleDelete: (appId: number) => void;
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { list, handleDelete } = data as Props;
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const dataItem = list[index];

  return (
    <Fragment key={index}>
      <ListItem button style={style}>
        <ListItemText
          primaryTypographyProps={{ noWrap: true }}
          style={styleTruncate}
          primary={dataItem.name}
          secondary={`App id - ${dataItem.appId} & Last Used - ${moment(
            dataItem.lastUsed
          ).format('DD MM YYYY HH:mm')} & Deleted - ${
            dataItem.deleted ? 'yes' : 'no'
          }`}
        />
        <IconButton onClick={handleOpenModal}>
          <ChevronRight />
        </IconButton>
        <IconButton onClick={() => handleDelete(dataItem.appId)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <ModalDialog
        open={open}
        onClose={handleCloseModal}
        title={dataItem.name}
        withActions={false}
      >
        <Typography color="textSecondary" gutterBottom>
          {dataItem.name}
        </Typography>
        <Typography
          color="textSecondary"
          gutterBottom
          style={{ wordBreak: 'break-all' }}
        >
          {dataItem.token}
        </Typography>
      </ModalDialog>
    </Fragment>
  );
};

