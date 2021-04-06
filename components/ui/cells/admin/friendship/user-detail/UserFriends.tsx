import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { QuizFriendType, VkFriendItem } from 'core/models/admin';
import { memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { styleTruncate } from 'ui/atoms/constants';

export const UserFriendsList = memo<{ list: VkFriendItem[] }>(({ list = [] }) => {
  return (
    <Box width="100%" marginTop="2rem">
      <Box marginLeft="1rem" display="flex" alignItems="center">
        <Typography variant="subtitle1" gutterBottom>
          Друзья
        </Typography>
      </Box>
      <Box width="100%" height="300px">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              itemData={{
                list,
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
    </Box>
  );
});
type Props = {
  list: VkFriendItem[];
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
        primary={list[index].firstName ?? '' + list[index].lastName ?? ''}
        secondary={
          list[index].friendType === QuizFriendType.Anon ? 'прошел анонимно' : ''
        }
      />
      <IconButton>
        {list[index].rightsNumber} из {list[index].questionsNumber}
      </IconButton>
    </ListItem>
  );
};
