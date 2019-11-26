import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export const TextField: React.FC<TextFieldProps> = React.memo(
  ({ className, ...props }) => {
    const classes = useStyles({ textArea: props.multiline });
    const [showPass, setShowPass] = React.useState(false);
    const handleClickShowPassword = React.useCallback(() => {
      setShowPass(!showPass);
    }, [showPass]);
    return (
      <MuiTextField
        className={`${className} ${classes.input}`}
        InputProps={
          props.name === 'password'
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="Toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {!showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            : {}
        }
        {...props}
        type={props.name === 'password' && showPass ? 'text' : props.type}
      />
    );
  }
);

const useStyles = makeStyles(theme => ({
  input: (props: { textArea: boolean }) => ({
    marginLeft: '1rem',
    marginRight: '1rem',
    minHeight: props.textArea ? '8rem' : '4rem',
    '&>label': {
      color: theme.palette.primary.main
    },
    '&>.MuiFormHelperText-filled': {
      color: theme.palette.primary.main
    }
  })
}));
