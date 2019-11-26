import * as React from 'react';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const arrowGenerator = (color: string) => {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${color} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${color} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${color} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${color}`,
      },
    },
  };
}

const useStylesArrow = makeStyles((theme: Theme) =>
  createStyles({
    arrow: {
      position: 'absolute',
      fontSize: 6,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
    popper: arrowGenerator(theme.palette.common.black),
    tooltip: {
      backgroundColor: theme.palette.common.black,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    tooltipPlacementLeft: {
      margin: '0 8px',
    },
    tooltipPlacementRight: {
      margin: '0 8px',
    },
    tooltipPlacementTop: {
      margin: '8px 0',
    },
    tooltipPlacementBottom: {
      margin: '8px 0',
    },
  }),
);

export const ArrowTooltip: React.FC<TooltipProps> = React.memo((props) => {
  const { arrow, ...classes } = useStylesArrow({});
  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement | null>(null);

  return (
    <Tooltip
      classes={classes}
      PopperProps={{
        popperOptions: {
          modifiers: {
            arrow: {
              enabled: Boolean(arrowRef),
              element: arrowRef,
            },
          },
        },
      }}
      {...props}
      title={
        <>
          {props.title}
          <span className={arrow} ref={setArrowRef} />
        </>
      }
    />
  );
});
