import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { ChevronRight, Refresh } from '@material-ui/icons';
import { goToDeep } from 'core/common';
import { DelationItem } from 'core/models/admin';
import { memo, useCallback, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { styleTruncate } from 'ui/atoms/constants';
import { getDelationList } from './operations';

export const DelationList = memo(() => {
  const [banList, setList] = useState<DelationItem[]>([]);
  const loadList = useCallback(() => getDelationList().then(setList), []);
  useEffect(() => {
    loadList();
  }, []);
  return (
    <Box width="100%">
      <Box marginLeft="1rem" display="flex" alignItems="center">
        <Typography variant="subtitle1" gutterBottom>
          Доносы
        </Typography>
        <IconButton onClick={loadList}>
          <Refresh />
        </IconButton>
      </Box>
      <Box width="100%" height="300px">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              itemData={{
                list: banList,
              }}
              height={height}
              width={width}
              itemSize={46}
              itemCount={banList.length}
              style={{
                overflowX: 'hidden',
              }}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
});
type Props = {
  list: DelationItem[];
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { list } = data as Props;

  return (
    <ListItem button style={style} key={index} onClick={() => goToDeep(`friend/${list[index].userId}`)}>
      <ListItemAvatar>
        <Avatar src={list[index].avatar} />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ noWrap: true }}
        style={styleTruncate}
        primary={list[index].name}
        secondary={`Кол жалоб - ${list[index].amountDelations}`}
      />
      <IconButton>
        <ChevronRight />
      </IconButton>
    </ListItem>
  );
};
