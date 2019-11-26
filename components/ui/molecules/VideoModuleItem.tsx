import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect as redux } from 'react-redux';
import { AppState, AppDispatch } from 'core/models';
import { Dispatch } from 'redux';

type OwnProps = {
  videoId: string;
  videoTitle: string;
  ordinal: number;
  toggleLoading: (arg: boolean) => void
};

type Props = {
  selectedVideoId: string;
  selectVideoId: (payload: string) => void;
} & OwnProps;

const VideoModuleItemComponent: React.FC<Props> = React.memo(
  ({ videoId, videoTitle, ordinal, selectVideoId, selectedVideoId, toggleLoading }) => {
    const classes = useStyles({ seleceted: selectedVideoId === videoId });

    React.useEffect(() => {
      if (ordinal === 0) {
        toggleVideo();
      }
    }, []);

    const toggleVideo = React.useCallback(() => {
      toggleLoading(true);
      selectVideoId(videoId);
    }, [videoId])

    return (
      <div
        className={classes.videoContentItem}
        onClick={toggleVideo}
      >
        <div className={classes.videoContentItemImg}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
            alt={videoTitle}
          />
        </div>
        <span className={classes.videoContentItemImgText}>{videoTitle}</span>
      </div>
    );
  }
);

export const VideoModuleItem = redux(
  (state: AppState, props: OwnProps) => ({
    selectedVideoId: '1'
  }),
  (dispatch: Dispatch<AppDispatch>) => ({
    selectVideoId: (payload: string) => {
    }
  })
)(VideoModuleItemComponent);

const useStyles = makeStyles(theme => ({
  videoContentItem: ({ seleceted }: {seleceted: boolean}) => ({
    display: 'flex',
    height: 50,
    backgroundColor: seleceted ? '#525252' : '#232323',
    cursor: 'pointer',
    boxShadow: '0px 8px 20px 0px rgba(0,0,0,0.39)',
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: 'none'
    },
    '&:hover': {
      backgroundColor: '#3a3939'
    },
    transition: '.2s ease-in-out'
  }),
  videoContentItemImg: {
    minWidth: 75,
    height: 50,
    '&>img': {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  },
  videoContentItemImgText: {
    color: theme.palette.text.secondary,
    padding: '.5rem .25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));
