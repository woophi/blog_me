import * as React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

export const DragHandler = SortableHandle(props => {
  const classes = useStyles({});
  return <Icon className={`fas fa-sort ${classes.handler}`} />;
});

const useStyles = makeStyles(theme => ({
  handler: {
    cursor: 'grab',
    marginRight: '10px',
    width: '13px',
    fontSize: '13px',
    userSelect: 'none',
    alignSelf: 'center',
    '&:active': {
      cursor: 'grabbing'
    },
    '&:focus': {
      cursor: 'grabbing'
    },
    '&:hover': {
      cursor: 'grabbing'
    }
  }
}));
