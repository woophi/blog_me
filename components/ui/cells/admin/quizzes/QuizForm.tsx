import * as React from 'react';
import { TextField, ButtonsForm, Snakbars, ActionButton, TabPanel } from 'ui/atoms';
import { safeTrim, theme } from 'core/lib';
import { Form, Field } from 'react-final-form';
import { makeStyles } from '@material-ui/core';
import { FORM_ERROR } from 'final-form';
import arrayMutators from 'final-form-arrays';
import { goToSpecific } from 'core/common';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import { createNewQuiz, editQuiz, deleteQuiz } from './operations';
import { AdminQuizData } from 'core/models/admin';
import { QuillEditor } from 'ui/molecules/quill-editor';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

type Props = {
  quizId?: number;
  initialValues?: AdminQuizData;
};

type QuizForm = AdminQuizData;

const validate = (values: QuizForm) => {
  const errors: Partial<QuizForm> = {};
  if (!safeTrim(values.title)) {
    errors.title = 'Обязательно к заполнению';
  }
  if (!safeTrim(values.subtitle)) {
    errors.subtitle = 'Обязательно к заполнению';
  }
  return errors;
};

const onSubmit = async (data: QuizForm, quizId?: number) => {
  try {
    if (quizId) {
      await editQuiz({ ...data, quizId });
    } else {
      const { quizId } = await createNewQuiz(data);
      goToSpecific(`/admin/quizzes/edit/${quizId}`);
    }
  } catch (error) {
    return { [FORM_ERROR]: JSON.stringify(error.error) };
  }
};

const QuizForm: React.FC<Props> = React.memo(({ quizId, initialValues = {} }) => {
  const classes = useStyles({});
  const inputLabelSLID = React.useRef<any>(null);
  const [labelWidthSLID, setLabelWidthSLID] = React.useState(0);
  const [tabValue, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!quizId) {
      setLabelWidthSLID(inputLabelSLID.current?.offsetWidth ?? 0);
    }
  }, []);

  const hundleDeletBlog = () => deleteQuiz(quizId);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {quizId && (
        <ActionButton
          action={hundleDeletBlog}
          label={'Удалить quiz'}
          backToUrl={'/admin/quizzes'}
          className={classes.delete}
        />
      )}
      <Form
        onSubmit={(d: QuizForm) => onSubmit(d, quizId)}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={
          quizId
            ? {
                ...initialValues,
              }
            : {
                title: '<p><br></p>',
                subtitle: '<p><br></p>',
              }
        }
        render={({
          handleSubmit,
          pristine,
          submitting,
          submitError,
          form,
          submitSucceeded,
          invalid,
        }) => (
          <form
            onSubmit={async (event) => {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              if (!quizId) {
                form.reset();
              } else {
                form.setConfig('initialValues', form.getState().values);
              }
            }}
            className={classes.form}
          >
            <Snakbars
              variant="error"
              message={submitError}
              className={classes.field}
            />
            <Snakbars
              variant="success"
              message={submitSucceeded && !submitError ? 'Updated' : null}
              className={classes.field}
              timerValue={1000}
            />
            <Box padding="1rem">
              <Paper>
                <Tabs
                  value={tabValue}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="secondary"
                  centered
                >
                  <Tab label="Editor" />
                  <Tab label="Preview" />
                </Tabs>
              </Paper>
            </Box>

            <Field
              name="title"
              render={({ input: { onChange, value, onBlur, onFocus } }) => (
                <Box className={classes.field}>
                  <TabPanel value={tabValue} index={0}>
                    <QuillEditor
                      onChange={onChange}
                      value={value}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      ownId={'title-quizz'}
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <Box minWidth="50vw" padding="1rem" maxWidth="720px">
                      <Typography component="div" gutterBottom>
                        <div className="quill ">
                          <div className="ql-snow">
                            <div
                              className="ql-editor"
                              dangerouslySetInnerHTML={{ __html: value }}
                            />
                          </div>
                        </div>
                      </Typography>
                    </Box>
                  </TabPanel>
                </Box>
              )}
            />
            <Field
              name="subtitle"
              render={({ input: { onChange, value, onBlur, onFocus } }) => (
                <Box className={classes.field}>
                  <TabPanel value={tabValue} index={0}>
                    <QuillEditor
                      onChange={onChange}
                      value={value}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      ownId={'subtitle-quizz'}
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <Box minWidth="50vw" padding="1rem" maxWidth="720px">
                      <Typography component="div" gutterBottom>
                        <div className="quill ">
                          <div className="ql-snow">
                            <div
                              className="ql-editor"
                              dangerouslySetInnerHTML={{ __html: value }}
                            />
                          </div>
                        </div>
                      </Typography>
                    </Box>
                  </TabPanel>
                </Box>
              )}
            />
            <ButtonsForm
              pristine={pristine}
              submitting={submitting}
              both
              onCancel={form.reset}
              submitLabel={quizId ? 'common:buttons.save' : 'common:buttons.add'}
              invalid={invalid}
            />
          </form>
        )}
      />
    </>
  );
});

export default QuizForm;

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 320,
    maxWidth: '50vw',
    width: '100%',
    margin: '1rem auto',
  },
  field: {
    margin: '0 1rem 1rem',
  },
  fieldInArray: {
    margin: '0 1rem .5rem 0',
  },
  delete: {
    margin: '1.3rem auto',
  },
}));
