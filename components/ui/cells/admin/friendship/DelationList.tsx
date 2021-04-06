import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { DelationItem } from 'core/models/admin';
import { memo, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { styleTruncate } from 'ui/atoms/constants';
import { getDelationList } from './operations';

export const DelationList = memo(() => {
  const [banList, setList] = useState<DelationItem[]>([]);
  useEffect(() => {
    getDelationList().then(setList);
  }, []);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          itemData={{
            list: banList,
          }}
          height={height - 35}
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
  );
});
type Props = {
  list: DelationItem[];
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { list } = data as Props;

  return (
    <ListItem button style={style} key={index}>
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
