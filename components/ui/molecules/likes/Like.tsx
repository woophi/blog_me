import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { dislikeBlog, likeBlog, getGuestLikeState } from './operations';

type Props = {
  blogId: number;
};

export const Like = React.memo<Props>(({ blogId }) => {
  const [animate, setAnimate] = React.useState(null);
  const [liked, setLike] = React.useState(false);
  const classes = useStyles({ selected: liked });

  React.useEffect(() => {
    setLike(getGuestLikeState(blogId));
  }, [blogId]);

  const handleClick = () => {
    setAnimate(liked ? classes.dislike : classes.is_like);
    if (liked) {
      dislikeBlog(blogId);
    } else {
      likeBlog(blogId);
    }
    setLike(!liked);
  };

  return (
    <div onClick={handleClick} className={`${classes.heart}  ${animate || ''}`} />
  );
});

const useStyles = makeStyles(theme => ({
  heart: ({ selected }: { selected: boolean }) => ({
    cursor: 'pointer',
    height: '60px',
    width: '60px',
    backgroundImage: `url( '/img/like_anim.png')`,
    backgroundPosition: selected ? 'right' : 'left',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '2900%',
    margin: 'auto'
  }),
  is_like: {
    animation: '$heart-burst .8s steps(28) 1'
  },
  dislike: {
    animation: '$heart-burst-reverse .8s steps(28) 1'
  },
  '@keyframes heart-burst': {
    from: {
      backgroundPosition: 'left'
    },
    to: {
      backgroundPosition: 'right'
    }
  },
  '@keyframes heart-burst-reverse': {
    to: {
      backgroundPosition: 'left'
    },
    from: {
      backgroundPosition: 'right'
    }
  }
}));
