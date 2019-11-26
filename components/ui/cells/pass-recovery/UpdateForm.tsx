import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, ButtonsForm, Snakbars } from 'ui/atoms';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'server/lib/i18n';
import { FORM_ERROR } from 'final-form';
import { updatePassword } from 'core/operations';
import { login, ensureAuthorized } from 'core/operations/auth';
import { store } from 'core/store';

type UpdateForm = {
  password: string;
};

const validate = (values: UpdateForm, t: (s: string) => string) => {
  const errors: Partial<UpdateForm> = {};

  if (!values.password) {
    errors.password = t('common:forms.field.required');
  }
  return errors;
};

const onSubmit = async (data: UpdateForm, linkId: string) => {
  try {
    const email = await updatePassword(data.password, linkId);
    if (email) {
      const { token } = await login(email, data.password);
      store.dispatch({ type: 'SET_USER_TOKEN', payload: token });
      await ensureAuthorized();
    }
  } catch (error) {
    return { [FORM_ERROR]: error.error };
  }
};

type Props = {
  linkId: string
}

export const UpdateForm: React.FC<Props> = ({ linkId }) => {
  const classes = useStyles({});
  const [done, setDone] = React.useState(false);
  const { t } = useTranslation();
  return (
    <Form
      onSubmit={(d: UpdateForm) => onSubmit(d, linkId)}
      validate={(v: UpdateForm) => validate(v, t)}
      render={({ handleSubmit, pristine, submitting, submitError, form }) => (
        <>
          <form
            onSubmit={async event => {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              setDone(true);
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
            <Snakbars
              variant="success"
              message={done ? 'Пароль изменен' : ''}
              onClose={() => setDone(false)}
              style={{
                margin: '0 1rem .5rem'
              }}
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
              submitLabel={'common:buttons.send'}
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
