import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

export const generalOptionsPalette: PaletteOptions = {
  primary: deepPurple,
  secondary: orange,
  error: red,
  type: 'dark'
};

export const theme = createMuiTheme({
  palette: {
    ...generalOptionsPalette
  }
});
