import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { goToDeep } from 'core/common';
import { DelationItem } from 'core/models/admin';
import { memo, useCallback, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { ActionButton } from 'ui/atoms/ActionButton';
import { styleTruncate } from 'ui/atoms/constants';
import { getDelationList } from './operations';

export const DelationList = memo(() => {
  const [banList, setList] = useState<DelationItem[]>([]);
  const loadList = useCallback(() => getDelationList().then(setList), []);
  return (
    <Box width="100%">
      <Box margin="1rem">
        <ActionButton label={'Доносы'} action={loadList} fetchOnMount />
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

  const handleClick = () => {
    goToDeep(`friend/${list[index].userId}`);
  };

  return (
    <ListItem button style={style} key={index} onClick={handleClick}>
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
