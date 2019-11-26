import * as React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';

type Props = {
  href: string;
  label: React.ReactNode;
  insideTooltip?: boolean;
} & ButtonProps;

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    padding: 0,
    maxWidth: '14rem'
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    padding: '6px 8px',
    width: '100%',
    height: '100%'
  },
  fabText: {
    textDecoration: 'none',
    fontSize: 12,
    color: `${theme.palette.text.secondary} !important`
  }
}));

export const LinkButton: React.FC<Props> = React.memo(
  ({ href, label, insideTooltip = false, ...props }) => {
    const classes = useStyles({});
    if (insideTooltip) {
      return (
        <Button
          className={classes.button}
          variant="outlined"
          size="small"
          color="primary"
        >
          <Link href={href}>
            <a className={classes.fabText}>
              {label}
            </a>
          </Link>
        </Button>
      )
    }
    return (
      <Button
        className={classes.button}
        {...props}
      >
        <Link href={href}>
          <a className={classes.link}>
            {label}
          </a>
        </Link>
      </Button>
    );
  }
);
