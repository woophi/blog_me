import * as React from 'react';
import { ButtonsForm, Snakbars, ActionButton, TabPanel } from 'ui/atoms';
import { safeTrim, theme } from 'core/lib';
import { Form, Field } from 'react-final-form';
import { makeStyles } from '@material-ui/core';
import { FORM_ERROR, FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';
import { goToSpecific } from 'core/common';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import { createNewQuiz, editQuiz, deleteQuiz, updateQuestions } from './operations';
import {
  QuizzStatus,
  AdminQuizFormData,
  SaveQuestionModel,
  QuizQuestionType,
} from 'core/models/admin';
import { QuillEditor, quillPlaceholder } from 'ui/molecules/quill-editor';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { FieldArray } from 'react-final-form-arrays';
import Button from '@material-ui/core/Button';
import { SortableFactory } from 'ui/molecules/sortable';

type Props = {
  quizId?: number;
  initialValues?: AdminQuizFormData;
};

type QuizForm = AdminQuizFormData;

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

const onSubmit = async (data: QuizForm, quizId?: number, f?: FormApi<QuizForm>) => {
  try {
    if (quizId) {
      let questions: SaveQuestionModel[] = [];
      if (data.questions?.length) {
        questions = await updateQuestions(data.questions, data.id);
      }
      await editQuiz({ ...data, quizId, questions: questions.map((q) => q.id) });
      f.setConfig('initialValues', { ...f.getState().values, questions });
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
  const [tabValue, setValue] = React.useState(0);
  const inputLabelSLID = React.useRef<any>(null);
  const [labelWidthSLID, setLabelWidthSLID] = React.useState(0);

  React.useEffect(() => {
    setLabelWidthSLID(inputLabelSLID.current?.offsetWidth ?? 0);
  }, [inputLabelSLID.current]);

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
        onSubmit={(d: QuizForm, f) => onSubmit(d, quizId, f)}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={
          quizId
            ? initialValues
            : {
                title: quillPlaceholder,
                subtitle: quillPlaceholder,
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

            {quizId && (
              <Field
                name="status"
                render={({ input, meta }) => (
                  <FormControl variant="outlined" className={classes.field}>
                    <InputLabel
                      htmlFor="localeId"
                      ref={inputLabelSLID}
                      style={{ color: theme.palette.primary.main }}
                    >
                      {'Сатус quiza'}
                    </InputLabel>
                    <Select
                      {...input}
                      input={
                        <OutlinedInput labelWidth={labelWidthSLID} id="localeId" />
                      }
                      error={Boolean(meta.touched && meta.error)}
                      disabled={submitting}
                    >
                      <MenuItem value={QuizzStatus.Open}>{'Открыт'}</MenuItem>
                      <MenuItem value={QuizzStatus.Closed}>{'Закрыт'}</MenuItem>
                      <MenuItem value={QuizzStatus.Draft}>{'Черновик'}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            )}

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

            {quizId && (
              <FieldArray name="questions">
                {({ fields }) => {
                  const onSortEnd = ({ oldIndex, newIndex }) => {
                    fields.move(oldIndex, newIndex);
                  };
                  const removeCb = (index: number) => {
                    fields.remove(index);
                  };
                  return (
                    <div className={classes.field}>
                      <InputLabel style={{ marginBottom: '.5rem' }}>
                        {'Вопросы'}
                      </InputLabel>

                      <SortableFactory
                        items={fields}
                        onSortEnd={onSortEnd}
                        lockAxis="y"
                        removeCb={removeCb}
                        lockToContainerEdges
                        useDragHandle
                        transitionDuration={200}
                        tabValue={tabValue}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          fields.push({
                            question: quillPlaceholder,
                            step: fields.length + 1,
                            id: '',
                            type: QuizQuestionType.SIMPLE,
                          })
                        }
                        disabled={submitting}
                      >
                        {'Добавить вопрос'}
                      </Button>
                    </div>
                  );
                }}
              </FieldArray>
            )}
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
