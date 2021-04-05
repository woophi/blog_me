import { ListItem, ListItemText } from '@material-ui/core';
import { BlackListItem } from 'core/models/admin';
import { memo, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { styleTruncate } from 'ui/atoms/constants';
import { getBlackList } from './operations';

export const BanList = memo(() => {
  const [banList, setList] = useState<BlackListItem[]>([]);
  useEffect(() => {
    getBlackList().then(setList);
  }, []);
  return (
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
  );
});
type Props = {
  list: BlackListItem[];
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { list } = data as Props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText
        primaryTypographyProps={{ noWrap: true }}
        style={styleTruncate}
        primary={list[index].name}
      />
    </ListItem>
  );
};
