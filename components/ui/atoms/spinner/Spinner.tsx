import * as React from 'react';
import './spinner.css';

type Props = {
  isShow?: boolean;
  withBox?: boolean;
};

export const Spinner = React.memo<Props>(({ isShow = true, withBox = false }) => {
  if (withBox) {
    return (
      isShow && (
        <div style={box}>
          <div style={container}>
            <div className="spinner">
              <div className="cube1" />
              <div className="cube2" />
            </div>
          </div>
        </div>
      )
    );
  }
  return (
    isShow && (
      <div style={container}>
        <div className="spinner">
          <div className="cube1" />
          <div className="cube2" />
        </div>
      </div>
    )
  );
});

const container: React.CSSProperties = {
  zIndex: 2,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, .5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const box: React.CSSProperties = {
  width: '100%',
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, .5)',
};
