import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  h1: ({ upperCase }: Props) => ({
    margin: '2rem auto 1rem',
    textTransform: upperCase ? 'uppercase': 'unset'
  })
}));

type Props = {
  upperCase?: boolean
}

export const H1: React.FC<Props> = React.memo(({ children, upperCase = false }) => {
  const classes = useStyles({ upperCase });
  return <h1 className={classes.h1}>{children}</h1>;
});
