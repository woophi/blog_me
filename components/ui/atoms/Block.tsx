import * as React from 'react';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Router from 'next/router';

type Props = {
  title: string;
  subTitle: string;
  imgSrc: string;
  href: string;
  timeOut?: number;
};

export const Block: React.FC<Props> = React.memo(
  ({ title, imgSrc, href, subTitle, timeOut = 1000 }) => {
    const [mounted, setMount] = React.useState(false);
    const classes = useStyles({});
    React.useEffect(() => {
      setMount(true);
    }, []);
    const goTo = () => Router.push(`${Router.route}/${href}`);
    return (
      <Grow in={mounted} {...(mounted ? { timeout: timeOut } : {})}>
        <Paper elevation={4} className={classes.paper}>
          <Typography
            className={classes.m}
            variant="button"
            display="block"
            gutterBottom
          >
            {title}
          </Typography>
          <div className={classes.overlay} onClick={goTo}>
            <Typography
              variant="button"
              display="block"
              gutterBottom
            >
              {subTitle}
            </Typography>
          </div>
          <img className={classes.img} src={imgSrc} width="100%" height="100%" />
        </Paper>
      </Grow>
    );
  }
);

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    height: '320px',
    width: '320px',
    position: 'relative',
    margin: '1.5rem auto',
    cursor: 'pointer',
    '&:hover>div': {
      visibility: 'visible',
      opacity: 1
    },
  },
  m: {
    display: 'flex',
    alignSelf: 'center',
    margin: '0 auto 1rem',
    position: 'absolute',
    top: -32
  },
  img: {
    objectFit: 'cover'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(202, 188, 171, 0.7)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    visibility: 'hidden',
    opacity: 0,
    transition: '.2s ease-in-out'
  }
}));
