import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, ButtonsForm, Snakbars } from 'ui/atoms';
import { Form, Field } from 'react-final-form';
import { testEmail } from 'core/lib';
import { useTranslation } from 'server/lib/i18n';
import { FORM_ERROR } from 'final-form';
import { resetPassword } from 'core/operations';

type ResetForm = {
  email: string;
};

const validate = (values: ResetForm, t: (s: string) => string) => {
  const errors: Partial<ResetForm> = {};

  if (!values.email) {
    errors.email = t('common:forms.field.required');
  }
  if (values.email && !testEmail.test(values.email.toLowerCase())) {
    errors.email = t('common:forms.field.invalid');
  }
  return errors;
};

const onSubmit = async (data: ResetForm) => {
  try {
    await resetPassword(data.email);
  } catch (error) {
    return { [FORM_ERROR]: error.error };
  }
};

export const ResetForm: React.FC = () => {
  const classes = useStyles({});
  const [done, setDone] = React.useState(false);
  const { t } = useTranslation();
  return (
    <Form
      onSubmit={onSubmit}
      validate={(v: ResetForm) => validate(v, t)}
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
              message={done ? 'На Вашу почту должно придти письмо' : ''}
              onClose={() => setDone(false)}
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
