import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Field } from 'react-final-form';
import { testEmail } from 'core/lib';
import { sendMessage } from 'core/operations';
import { FORM_ERROR } from 'final-form';
import { Snakbars } from 'ui/atoms/Snakbars';
import { TextField } from 'ui/atoms/TextField';
import { ButtonsForm } from 'ui/atoms/ButtonsForm';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const validate = (values: ContactForm) => {
  const errors: Partial<ContactForm> = {};

  if (!values.email) {
    errors.email = 'Пожалуйста, заполните это поле';
  }
  if (values.email && !testEmail.test(values.email.toLowerCase())) {
    errors.email = 'Введенные данные неверные';
  }
  if (!values.name) {
    errors.name = 'Пожалуйста, заполните это поле';
  }
  if (!values.message) {
    errors.message = 'Пожалуйста, заполните это поле';
  }

  return errors;
};

const onSubmit = async (data: ContactForm) => {
  try {
    await sendMessage(data);
  } catch (error) {
    return { [FORM_ERROR]: JSON.stringify(error.error) };
  }
};

export const ContactForm: React.FC = () => {
  const classes = useStyles({});
  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({
        handleSubmit,
        pristine,
        submitting,
        invalid,
        submitError,
        submitSucceeded,
      }) => (
        <form
          className={classes.form}
          onSubmit={async (event) => {
            const error = await handleSubmit(event);
            if (error) {
              return error;
            }
          }}
        >
          <Snakbars variant="error" message={submitError} />
          <Snakbars
            variant="success"
            message={submitSucceeded && !submitError ? 'Сообщение отправлено' : null}
            timerValue={1000}
          />
          <Field
            name="name"
            render={({ input, meta }) => (
              <TextField
                id="outlined-name-input"
                label="Name"
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
                label="E-mail"
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
                label="Message"
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
          <ButtonsForm
            pristine={pristine}
            submitting={submitting}
            invalid={invalid}
          />
        </form>
      )}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    margin: '2rem auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '320px',
    maxWidth: '50%',
  },
}));
