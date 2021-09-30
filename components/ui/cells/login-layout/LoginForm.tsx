import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Field } from 'react-final-form';
import { testEmail } from 'core/lib';
import { useTranslation } from 'next-i18next';
import { FORM_ERROR } from 'final-form';
import { store } from 'core/store';
import { login, ensureAuthorized } from 'core/operations/auth';
import { TextField } from 'ui/atoms/TextField';
import { Snakbars } from 'ui/atoms/Snakbars';
import { ButtonsForm } from 'ui/atoms/ButtonsForm';

type LoginForm = {
  email: string;
  password: string;
};

const validate = (values: LoginForm, t: (s: string) => string) => {
  const errors: Partial<LoginForm> = {};

  if (!values.email) {
    errors.email = t('common:forms.field.required');
  }
  if (values.email && !testEmail.test(values.email.toLowerCase())) {
    errors.email = t('common:forms.field.invalid');
  }
  if (!values.password) {
    errors.password = t('common:forms.field.required');
  }
  return errors;
};

const onSubmit = async (data: LoginForm) => {
  try {
    const { token } = await login(data.email, data.password);
    store.dispatch({ type: 'SET_USER_TOKEN', payload: token });
    await ensureAuthorized();
  } catch (error) {
    return { [FORM_ERROR]: JSON.stringify(error.error) };
  }
};

export const LoginForm: React.FC = () => {
  const classes = useStyles({});
  const { t } = useTranslation();
  return (
    <Form
      onSubmit={onSubmit}
      validate={(v: LoginForm) => validate(v, t)}
      render={({ handleSubmit, pristine, submitting, submitError, form, invalid }) => (
        <>
          <form
            onSubmit={async event => {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              form.reset();
            }}
            className={classes.form}
          >
            <Snakbars
              variant="error"
              message={submitError}
              style={{
                margin: '0 1rem .5rem'
              }}
            />
            <Field
              name="email"
              render={({ input, meta }) => (
                <TextField
                  {...input}
                  id="outlined-email-input"
                  label={t('common:forms.email')}
                  type="text"
                  name="email"
                  margin="normal"
                  variant="outlined"
                  autoComplete="email"
                  required
                  error={Boolean(meta.touched && meta.error)}
                  helperText={meta.touched && meta.error}
                  disabled={submitting}
                />
              )}
            />
            <Field
              name="password"
              render={({ input, meta }) => (
                <TextField
                  {...input}
                  id="outlined-password-input"
                  label={t('common:forms.password')}
                  type="password"
                  name="password"
                  autoComplete="password"
                  margin="normal"
                  variant="outlined"
                  required
                  error={Boolean(meta.touched && meta.error)}
                  helperText={meta.touched && meta.error}
                  disabled={submitting}
                />
              )}
            />
            <ButtonsForm
              pristine={pristine}
              submitting={submitting}
              both
              onCancel={form.reset}
              submitLabel={'common:buttons.login'}
              invalid={invalid}
            />
          </form>
        </>
      )}
    />
  );
};

const useStyles = makeStyles(theme => ({
  form: {
    margin: '0 auto 2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '320px',
    maxWidth: '50%'
  }
}));
