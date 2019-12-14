import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NavigationIcon from '@material-ui/icons/Navigation';

type LocalState = {
  show: boolean;
  disabled: boolean;
};

type ScrollButtonProps = {
  position: 'left' | 'right';
};

export class ScrollButton extends React.PureComponent<
  ScrollButtonProps,
  LocalState
> {
  static defaultProps: ScrollButtonProps = {
    position: 'left'
  };

  timeInterval: NodeJS.Timeout = null;
  mounted: boolean = false;

  state: LocalState = {
    show: false,
    disabled: false
  };

  get checkWindow() {
    if (typeof window !== 'undefined') return true;
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    if (this.checkWindow) {
      this.handleShow();
      window.addEventListener('scroll', this.handleShow);
      window.addEventListener('wheel', this.stopScrolling);
      window.addEventListener('touchstart', this.stopScrolling);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.checkWindow) {
      window.removeEventListener('scroll', this.handleShow);
      window.removeEventListener('wheel', this.stopScrolling);
      window.removeEventListener('touchstart', this.stopScrolling);
      clearInterval(this.timeInterval);
    }
  }

  handleShow = () => {
    if (this.mounted) {
      this.setState({ show: window.pageYOffset > 100 });
    }
  };

  stopScrolling = () => {
    this.setState({ disabled: false });
    clearInterval(this.timeInterval);
  };

  scrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(this.timeInterval);
    }
    window.scroll(0, window.pageYOffset - 50);
  };

  scrollToTop = () => {
    this.setState(
      {
        disabled: true
      },
      () => {
        let intervalId = setInterval(this.scrollStep, 16.66);
        this.timeInterval = intervalId;
      }
    );
  };

  render() {
    return (
      <ActionButton
        disabled={this.state.disabled}
        onClick={this.scrollToTop}
        visible={this.state.show}
        position={this.props.position}
      />
    );
  }
}

type Props = {
  onClick: () => void;
  visible: boolean;
  disabled: boolean;
} & ScrollButtonProps;

const ActionButton = React.memo<Props>(
  ({ onClick, visible, position, disabled }) => {
    const classes = useStyles({ visible, position });
    return (
      <IconButton
        color="secondary"
        className={classes.scrollTotop}
        onClick={onClick}
        disabled={disabled}
      >
        <NavigationIcon />
      </IconButton>
    );
  }
);

type StyleProps = {
  visible: boolean;
} & ScrollButtonProps;

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  scrollTotop: props => ({
    position: 'fixed',
    left: props.position === 'left' ? 15 : undefined,
    right: props.position === 'right' ? 15 : undefined,
    bottom: 20,
    opacity: props.visible ? 0.3 : 0,
    visibility: props.visible ? 'visible' : 'hidden',
    transition: '.2s ease-in-out',
    '&:hover': {
      opacity: props.visible ? 0.9 : 0,
      transform: props.visible ? 'scale(1.1)' : 'scale(1)'
    }
  })
}));
