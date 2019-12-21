import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import Wallpaper from '@material-ui/icons/Wallpaper';
import InsertPhoto from '@material-ui/icons/InsertPhoto';
import Block from '@material-ui/icons/Block';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Comment from '@material-ui/icons/Comment';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { connect as redux } from 'react-redux';
import { AppState } from 'core/models';
import * as constants from 'ui/atoms/constants';
import { getFacebookActiveStatus } from 'core/selectors/facebook';
import { theme } from 'core/lib';

type Props = {
  facebookActive: boolean;
};

const AdminMenuComponent = React.memo<Props>(({ facebookActive }) => {
  const classes = useStyles({});

  return (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem button onClick={constants.toBlogs}>
          <ListItemIcon>
            <Wallpaper />
          </ListItemIcon>
          <ListItemText primary={'Блоги'} />
        </ListItem>
        {/* <ListItem button onClick={toFiles}>
          <ListItemIcon>
            <Files />
          </ListItemIcon>
          <ListItemText primary={'файлы'} />
        </ListItem> */}
        <ListItem button onClick={constants.toComments}>
          <ListItemIcon>
            <Comment />
          </ListItemIcon>
          <ListItemText primary={'Комментарии'} />
        </ListItem>
        <ListItem button onClick={constants.toFacebook}>
          <ListItemIcon>
            <ThumbUp
              style={{
                color: facebookActive
                  ? theme.palette.primary.main
                  : theme.palette.error.main
              }}
            />
          </ListItemIcon>
          <ListItemText primary={'Facebook'} />
        </ListItem>
        <ListItem button onClick={constants.toInstagram}>
          <ListItemIcon>
            <InsertPhoto />
          </ListItemIcon>
          <ListItemText primary={'Instagram'} />
        </ListItem>

        <ListItem button onClick={constants.toUsers}>
          <ListItemIcon>
            <SupervisorAccount />
          </ListItemIcon>
          <ListItemText primary={'Пользователи'} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={constants.toBans}>
          <ListItemIcon>
            <Block />
          </ListItemIcon>
          <ListItemText primary={'Черный список'} />
        </ListItem>
      </List>
    </div>
  );
});

export const AdminMenu = redux((state: AppState) => ({
  facebookActive: getFacebookActiveStatus(state)
}))(AdminMenuComponent);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      ...theme.mixins.toolbar,
      minHeight: '73px !important'
    }
  })
);
