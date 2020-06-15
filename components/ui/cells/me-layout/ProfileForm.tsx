import * as React from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'core/selectors';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { safeTrim, testEmail } from 'core/lib';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';
import { ProfileFormModel } from 'core/models';
import { updateUserProfile } from 'core/operations/profile';
import { TextField } from 'ui/atoms/TextField';
import { Snakbars } from 'ui/atoms/Snakbars';
import { ButtonsForm } from 'ui/atoms/ButtonsForm';

const validate = (values: ProfileFormModel) => {
  const errors: Partial<ProfileFormModel> = {};
  if (!safeTrim(values.name)) {
    errors.name = 'Обязательно к заполнению';
  }
  if (!safeTrim(values.email)) {
    errors.email = 'Обязательно к заполнению';
  }
  if (values.email && !testEmail.test(values.email.toLowerCase())) {
    errors.email = 'Проверь формат';
  }
  return errors;
};

const onSubmit = async (data: ProfileFormModel) => {
  try {
    await updateUserProfile({
      email: data.email,
      name: data.name,
    });
  } catch (error) {
    return { [FORM_ERROR]: JSON.stringify(error.error) };
  }
};

export const ProfileForm = React.memo(() => {
  const user = useSelector(getUser);

  return (
    <>
      <Form
        onSubmit={onSubmit}
        validate={(v: ProfileFormModel) => validate(v)}
        initialValues={user}
        render={({
          handleSubmit,
          pristine,
          submitting,
          submitError,
          form,
          invalid,
          submitSucceeded,
        }) => (
          <>
            <Box
              onSubmit={async (event) => {
                const error = await handleSubmit(event);
                if (error) {
                  return error;
                }
                form.setConfig('initialValues', form.getState().values);
              }}
              component="form"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Snakbars variant="error" message={submitError} />
              <Snakbars
                variant="success"
                message={submitSucceeded && !submitError ? 'Обновлено' : null}
                timerValue={1000}
              />
              <Avatar
                alt={user.name}
                src={user.gravatarPhotoUrl}
                style={{ width: 80, height: 80 }}
              />
              <Field
                name="email"
                render={({ input, meta }) => (
                  <TextField
                    {...input}
                    id="outlined-email-input"
                    label={'E-mail'}
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
                name="name"
                render={({ input, meta }) => (
                  <TextField
                    {...input}
                    id="outlined-name-input"
                    label={'Имя'}
                    type="text"
                    name="name"
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
                submitLabel={'common:buttons.save'}
                invalid={invalid}
              />
            </Box>
          </>
        )}
      />
    </>
  );
});
