import * as React from 'react';
import { safeTrim } from 'core/lib';
import { newComment } from './operations';
import { Form, Field } from 'react-final-form';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FORM_ERROR } from 'final-form';
import { connect } from 'react-redux';
import { AppState } from 'core/models';
import { canUserComment, getUserName } from 'core/selectors';
import { AuthButtons } from './AuthButtons';
import { checkAuth } from 'core/operations/auth';
import { MenuComment } from './Menu';
import { TextField } from 'ui/atoms/TextField';
import { Snakbars } from 'ui/atoms/Snakbars';
import { ButtonsForm } from 'ui/atoms/ButtonsForm';

type OwnProps = {
  blogId: number;
  parentCommentId?: string;
};

const mapState = (state: AppState, _: OwnProps) => ({
  canAccess: canUserComment(state),
  userName: getUserName(state),
});

type Props = ReturnType<typeof mapState> & OwnProps;

type CommentForm = {
  name: string;
  message: string;
};

const validate = (values: CommentForm) => {
  const errors: Partial<CommentForm> = {};

  if (!values.message || !safeTrim(values.message)) {
    errors.message = 'Пожалуйста, заполните это поле';
  }
  if (!values.name || !safeTrim(values.name)) {
    errors.name = 'Пожалуйста, заполните это поле';
  }

  return errors;
};

const onSubmit = async (
  data: CommentForm,
  blogId: number,
  parentCommentId?: string
) => {
  try {
    await newComment(data, blogId, parentCommentId);
  } catch (error) {
    return { [FORM_ERROR]: 'Cannot add comment' };
  }
};

const AddCommentPC = React.memo<Props>(
  ({ blogId, canAccess, userName, parentCommentId }) => {
    React.useLayoutEffect(() => {
      checkAuth();
    }, []);
    const classes = useStyles({});

    return (
      <Paper elevation={4} className={classes.paper}>
        <Typography gutterBottom variant="body1">
          Добавить комментарий
        </Typography>
        {!canAccess && <AuthButtons />}
        {canAccess && (
          <Form
            onSubmit={(d: CommentForm) => onSubmit(d, blogId, parentCommentId)}
            validate={validate}
            initialValues={{
              message: '',
              name: userName,
            }}
            render={({
              handleSubmit,
              pristine,
              submitting,
              submitError,
              form,
              invalid,
            }) => (
              <>
                <Snakbars variant="error" message={submitError} />
                <form
                  onSubmit={async (event) => {
                    const error = await handleSubmit(event);
                    if (error) {
                      return error;
                    }
                    form.reset();
                  }}
                  className={classes.form}
                >
                  <Field
                    name="name"
                    render={({ input, meta }) => (
                      <TextField
                        id="outlined-name-input"
                        label="Имя"
                        type="text"
                        name="name"
                        fullWidth
                        required
                        className={classes.field}
                        {...input}
                        error={Boolean(meta.touched && meta.error)}
                        helperText={
                          (meta.touched && meta.error) || `${input.value.length}/256`
                        }
                        disabled={submitting}
                        inputProps={{
                          maxLength: 256,
                        }}
                      />
                    )}
                  />
                  <Field
                    name="message"
                    render={({ input, meta }) => (
                      <TextField
                        id="outlined-message-static"
                        label="Пиши тут"
                        multiline
                        rows="4"
                        fullWidth
                        className={classes.field}
                        {...input}
                        error={Boolean(meta.touched && meta.error)}
                        helperText={
                          (meta.touched && meta.error) ||
                          `${input.value.length}/2000`
                        }
                        disabled={submitting}
                        inputProps={{
                          maxLength: 2000,
                        }}
                      />
                    )}
                  />
                  <ButtonsForm
                    pristine={pristine}
                    submitting={submitting}
                    both
                    onCancel={form.reset}
                    submitLabel={'добавить'}
                    invalid={invalid}
                  />
                </form>
              </>
            )}
          />
        )}
      </Paper>
    );
  }
);

export const AddComment = connect(mapState)(AddCommentPC);

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
  },
  paper: {
    margin: '0 auto .5rem',
    padding: '1rem',
    maxWidth: '600px',
    width: '100%',
  },
  wrap: {
    position: 'relative',
  },
  field: {
    margin: 0,
  },
}));
