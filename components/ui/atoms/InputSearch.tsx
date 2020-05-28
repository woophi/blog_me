import * as React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

type Props = {
  placeholder?: string;
  onChangeCb: (v: string) => void;
  value: string;
};

export const InputSearch = React.memo<Props>(
  ({ placeholder = 'Поиск', onChangeCb, value = '' }) => {
    const classes = useStyles({});

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChangeCb(e.target.value);
    return (
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search input' }}
          onChange={handleChange}
          value={value}
        />
        <SearchIcon />
      </Paper>
    );
  }
);

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      margin: '0 .5rem .5rem'
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
  })
);
