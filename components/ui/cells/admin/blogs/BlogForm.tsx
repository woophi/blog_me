import * as React from 'react';
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
import moment from 'moment';
import { editBlog, createNewBlog, deleteBlog } from './operations';
import { BlogData } from 'core/models/admin';
import { QuillEditor } from 'ui/molecules/quill-editor';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { ActionButton } from 'ui/atoms/ActionButton';
import { Snakbars } from 'ui/atoms/Snakbars';
import { TabPanel } from 'ui/atoms/TabPanel';
import { ButtonsForm } from 'ui/atoms/ButtonsForm';
import { TextField } from 'ui/atoms/TextField';

type Props = {
  blogId?: number;
  initialValues?: BlogData;
};

type BlogForm = BlogData;

const validate = (values: BlogForm) => {
  const errors: Partial<BlogForm> = {};
  if (!safeTrim(values.coverPhotoUrl)) {
    errors.coverPhotoUrl = 'Обязательно к заполнению';
  }
  if (!safeTrim(values.body)) {
    errors.body = 'Обязательно к заполнению';
  }
  if (!safeTrim(values.publishedDate)) {
    errors.publishedDate = 'Обязательно к заполнению';
  }
  if (!safeTrim(values.shortText)) {
    errors.shortText = 'Обязательно к заполнению';
  }
  if (!safeTrim(values.title)) {
    errors.title = 'Обязательно к заполнению';
  }

  return errors;
};

const onSubmit = async (data: BlogForm, blogId?: number) => {
  try {
    if (blogId) {
      await editBlog(blogId, data);
    } else {
      const { blogId } = await createNewBlog(data);
      goToSpecific(`/admin/blogs/edit/${blogId}`);
    }
  } catch (error) {
    return { [FORM_ERROR]: JSON.stringify(error.error) };
  }
};

const BlogForm: React.FC<Props> = React.memo(({ blogId, initialValues = {} }) => {
  const classes = useStyles({});
  const inputLabelSLID = React.useRef<any>(null);
  const [labelWidthSLID, setLabelWidthSLID] = React.useState(0);
  const [tabValue, setValue] = React.useState(0);
  
  React.useEffect(() => {
    if (!blogId) {
      setLabelWidthSLID(inputLabelSLID.current?.offsetWidth ?? 0);
    }
  }, []);

  const hundleDeletBlog = () => deleteBlog(blogId);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {blogId && (
        <ActionButton
          action={hundleDeletBlog}
          label={'Удалить блог'}
          backToUrl={'/admin/blogs'}
          className={classes.delete}
        />
      )}
      <Form
        onSubmit={(d: BlogForm) => onSubmit(d, blogId)}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={
          blogId
            ? {
                ...initialValues,
                publishedDate: moment(
                  (initialValues as BlogData).publishedDate
                ).format('YYYY-MM-DD'),
                time: moment((initialValues as BlogData).publishedDate).format(
                  'hh:mm'
                ),
              }
            : {
                publishedDate: moment().format('YYYY-MM-DD'),
                language: 'ru',
                draft: true,
                body: '<p><br></p>',
              }
        }
        render={({
          handleSubmit,
          pristine,
          submitting,
          submitError,
          form,
          submitSucceeded,
          invalid
        }) => (
          <form
            onSubmit={async (event) => {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              if (!blogId) {
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
            <Field
              name="title"
              render={({ input, meta }) => (
                <TextField
                  label={'Название блога'}
                  type="text"
                  name="title"
                  required
                  variant="outlined"
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
              name="shortText"
              render={({ input, meta }) => (
                <TextField
                  label={'Краткое описание'}
                  type="text"
                  name="shortText"
                  required
                  variant="outlined"
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
              name="coverPhotoUrl"
              render={({ input, meta }) => (
                <TextField
                  label={'Картинка для preview'}
                  type="text"
                  name="coverPhotoUrl"
                  required
                  variant="outlined"
                  className={classes.field}
                  {...input}
                  error={Boolean(meta.touched && meta.error)}
                  helperText={meta.touched && meta.error}
                  disabled={submitting}
                />
              )}
            />
            <Field
              name="publishedDate"
              render={({ input, meta }) => (
                <TextField
                  label={'Дата публикации'}
                  name="publishedDate"
                  required
                  variant="outlined"
                  className={classes.field}
                  {...input}
                  type="date"
                  error={Boolean(meta.touched && meta.error)}
                  disabled={submitting}
                />
              )}
            />
            <Field
              name="time"
              render={({ input, meta }) => (
                <TextField
                  label={'Время публикации'}
                  name="time"
                  required
                  variant="outlined"
                  className={classes.field}
                  {...input}
                  type="time"
                  error={Boolean(meta.touched && meta.error)}
                  disabled={submitting}
                />
              )}
            />
            {!blogId ? (
              <Field
                name="language"
                render={({ input, meta }) => (
                  <FormControl variant="outlined" className={classes.field}>
                    <InputLabel
                      htmlFor="localeId"
                      ref={inputLabelSLID}
                      style={{ color: theme.palette.primary.main }}
                    >
                      {'Язык для публикации'}
                    </InputLabel>
                    <Select
                      {...input}
                      input={
                        <OutlinedInput labelWidth={labelWidthSLID} id="localeId" />
                      }
                      error={Boolean(meta.touched && meta.error)}
                      disabled={submitting}
                    >
                      <MenuItem value={'en'}>{'Английский'}</MenuItem>
                      <MenuItem value={'cs'}>{'Чешский'}</MenuItem>
                      <MenuItem value={'ru'}>{'Русский'}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            ) : null}
            <Field
              name="draft"
              render={({ input }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(input.value)}
                      onChange={input.onChange}
                      value="checkedB"
                      color="primary"
                    />
                  }
                  label={'Черновик'}
                  className={classes.field}
                />
              )}
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
              name="body"
              render={({ input: { onChange, value, onBlur, onFocus } }) => (
                <Box className={classes.field}>
                  <TabPanel value={tabValue} index={0}>
                    <QuillEditor
                      onChange={onChange}
                      value={value}
                      onBlur={onBlur}
                      onFocus={onFocus}
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
              submitLabel={blogId ? 'сохранить' : 'добавить'}
              invalid={invalid}
            />
          </form>
        )}
      />
    </>
  );
});

export default BlogForm;

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
