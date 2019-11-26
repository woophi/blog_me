import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

// Create a theme instance.
// FIXME: change theme style
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#cabcab',
      light: '#edebe8',
      "100": '#43a047'
    },
    secondary: {
      main: grey[900],
      light: "#efefef"
    },
    error: {
      main: red.A200,
    },
    background: {
      default: '#fff'
    },
    text: {
      secondary: '#fff'
    }
  },
});
