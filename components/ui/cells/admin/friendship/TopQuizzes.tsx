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
import { AppDispatchActions } from 'core/models';
import { PopularQuizItem } from 'core/models/admin';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { styleTruncate } from 'ui/atoms/constants';
import { getTopQuizzesList } from './operations';

export const TopQuizziesList = memo(() => {
  const [banList, setList] = useState<PopularQuizItem[]>([]);
  const loadList = useCallback(() => getTopQuizzesList().then(setList), []);
  useEffect(() => {
    loadList();
  }, []);
  return (
    <Box width="100%">
      <Box marginLeft="1rem" display="flex" alignItems="center">
        <Typography variant="subtitle1" gutterBottom>
          Популярные тесты
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
  list: PopularQuizItem[];
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { list } = data as Props;

  const dispatch = useDispatch<AppDispatchActions>();

  const handleClick = () => {
    dispatch({
      type: 'SELECT_VK_USER',
      payload: {
        avatar: list[index].avatar,
        firstName: list[index].firstName,
        lastName: list[index].lastName,
        name: list[index].name,
        userId: list[index].userId,
      },
    });
    goToDeep(`friend/${list[index].vkUserId}`);
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
        secondary={`Кол людей которые прошли тест - ${list[index].amountOfFriends}`}
      />
      <IconButton>
        <ChevronRight />
      </IconButton>
    </ListItem>
  );
};
