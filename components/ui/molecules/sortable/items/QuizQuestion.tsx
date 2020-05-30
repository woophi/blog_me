import { SortableElementProps } from 'react-sortable-hoc';
import * as React from 'react';
import { Field } from 'react-final-form';
import Box from '@material-ui/core/Box';
import { TabPanel } from 'ui/atoms';
import { QuillEditor } from '../../quill-editor';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import { DragHandler } from '../DragHandler';
import { theme } from 'core/lib';
import { QuizQuestionType } from 'core/models/admin';

type ItemProps = {
  itemK: any;
  tabValue: number;
  indexField: number;
  removeCb: (index: number) => void;
} & SortableElementProps;

export const QuizQuestion = React.memo<ItemProps>((props) => {
  const inputLabelSLID = React.useRef<any>(null);
  const [labelWidthSLID, setLabelWidthSLID] = React.useState(0);

  React.useEffect(() => {
    setLabelWidthSLID(inputLabelSLID.current?.offsetWidth ?? 0);
  }, [inputLabelSLID.current]);
  return (
    <div key={props.indexField}>
      <Field
        name={`${props.itemK}.step`}
        value={props.indexField + 1}
        render={({ input: { onChange, value, onBlur, onFocus } }) => (
          <InputLabel
            style={{ marginBottom: '.5rem', color: theme.palette.secondary.main }}
            color="secondary"
          >
            {onChange(props.indexField + 1)}
            {`Вопрос № ${value}`}
          </InputLabel>
        )}
      />
      <Box marginLeft="22px" marginBottom="1rem" marginTop="1rem">
        <Field
          name={`${props.itemK}.type`}
          render={({ input, meta }) => (
            <FormControl variant="outlined">
              <InputLabel
                htmlFor="localeId"
                style={{ color: theme.palette.secondary.main }}
                ref={inputLabelSLID}
              >
                {'Тип вопроса'}
              </InputLabel>
              <Select
                {...input}
                input={<OutlinedInput labelWidth={labelWidthSLID} id="localeId" />}
                error={Boolean(meta.touched && meta.error)}
              >
                <MenuItem value={QuizQuestionType.NOTE}>{'Заметка'}</MenuItem>
                <MenuItem value={QuizQuestionType.SIMPLE}>
                  {'Впрос с произвольным ответом'}
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Field
        name={`${props.itemK}.id`}
        render={({ input: { onChange, value, onBlur, onFocus } }) => (
          <div style={{ display: 'none' }} />
        )}
      />

      <Box display="flex" marginBottom="1rem">
        <DragHandler />
        <Field
          name={`${props.itemK}.question`}
          render={({ input: { onChange, value, onBlur, onFocus } }) => (
            <Box>
              <TabPanel value={props.tabValue} index={0}>
                <QuillEditor
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  ownId={`${props.indexField + 1}-question`}
                />
              </TabPanel>
              <TabPanel value={props.tabValue} index={1}>
                <Box minWidth="50vw" padding="1rem" maxWidth="720px">
                  <Typography component="div" gutterBottom>
                    <div className="quill ">
                      <div className="ql-snow">
                        <div
                          className="ql-editor"
                          dangerouslySetInnerHTML={{
                            __html: value,
                          }}
                        />
                      </div>
                    </div>
                  </Typography>
                </Box>
              </TabPanel>
            </Box>
          )}
        />
        <IconButton
          aria-label="delete"
          onClick={() => props.removeCb(props.indexField)}
          style={{ alignSelf: 'flex-end' }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </div>
  );
});
