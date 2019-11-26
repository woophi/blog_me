import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, ButtonsForm } from 'ui/atoms';
import { Form, Field } from 'react-final-form';
import { testEmail } from 'core/lib';
import { sendMessage } from 'core/operations';
import { useTranslation } from 'server/lib/i18n';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const validate = (values: ContactForm, t: (s: string) => string) => {
  const errors: Partial<ContactForm> = {};

  if (!values.email) {
    errors.email = t('common:forms.field.required');
  }
  if (values.email && !testEmail.test(values.email.toLowerCase())) {
    errors.email = t('common:forms.field.invalid');
  }
  if (!values.name) {
    errors.name = t('common:forms.field.required');
  }
  if (!values.message) {
    errors.message = t('common:forms.field.required');
  }

  return errors;
};

const onSubmit = async (data: ContactForm) => {
  await sendMessage(data);
};

export const ContactForm: React.FC = () => {
  const classes = useStyles({});
  const { t } = useTranslation();
  return (
    <Form
      onSubmit={onSubmit}
      validate={(v: ContactForm) => validate(v, t)}
      render={({ handleSubmit, pristine, submitting, form }) => (
        <form
          onSubmit={async event => await handleSubmit(event).then(form.reset)}
          className={classes.form}
        >
          <Field
            name="name"
            render={({ input, meta }) => (
              <TextField
                id="outlined-name-input"
                label={t('common:forms.name')}
                type="text"
                name="name"
                margin="normal"
                variant="outlined"
                required
                {...input}
                error={Boolean(meta.touched && meta.error)}
                helperText={meta.touched && meta.error}
                disabled={submitting}
              />
            )}
          />
          <Field
            name="email"
            render={({ input, meta }) => (
              <TextField
                id="outlined-email-input"
                label={t('common:forms.email')}
                type="email"
                name="email"
                autoComplete="email"
                margin="normal"
                variant="outlined"
                required
                {...input}
                error={Boolean(meta.touched && meta.error)}
                helperText={meta.touched && meta.error}
                disabled={submitting}
              />
            )}
          />
          <Field
            name="message"
            render={({ input, meta }) => (
              <TextField
                id="outlined-message-static"
                label={t('common:forms.message')}
                multiline
                rows="4"
                margin="normal"
                variant="outlined"
                {...input}
                error={Boolean(meta.touched && meta.error)}
                helperText={meta.touched && meta.error}
                disabled={submitting}
              />
            )}
          />
          <ButtonsForm pristine={pristine} submitting={submitting} />
        </form>
      )}
    />
  );
};

const useStyles = makeStyles(theme => ({
  form: {
    margin: '2rem auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '320px',
    maxWidth: '50%'
  }
}));
