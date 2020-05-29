import {
  SortableContainer,
  SortableElement,
  SortableContainerProps,
  SortableElementProps,
} from 'react-sortable-hoc';
import * as React from 'react';
import { Field } from 'react-final-form';
import Box from '@material-ui/core/Box';
import { TabPanel } from 'ui/atoms';
import { QuillEditor } from '../quill-editor';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { DragHandler } from './DragHandler';

type ItemProps = {
  itemK: any;
  tabValue: number;
  indexField: number;
  removeCb: (index: number) => void;
} & SortableElementProps;

const SortableItem = SortableElement<ItemProps>((props: ItemProps) => (
  <div key={props.indexField}>
    <Field
      name={`${props.itemK}.step`}
      value={props.indexField + 1}
      render={({ input: { onChange, value, onBlur, onFocus } }) => (
        <InputLabel style={{ marginBottom: '.5rem' }}>
          {onChange(props.indexField + 1)}
          {`Вопрос № ${value}`}
        </InputLabel>
      )}
    />
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
));

const SortableList = SortableContainer<Props>(({ items, removeCb, tabValue }) => {
  return (
    <Box>
      {items.map((itemK, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          itemK={itemK}
          removeCb={removeCb}
          indexField={index}
          tabValue={tabValue}
        />
      ))}
    </Box>
  );
});

type Props = {
  items: any;
  removeCb: (index: number) => void;
  tabValue: number;
} & SortableContainerProps;

export const SortableFactory = React.memo<Props>((props) => {
  return <SortableList {...props} />;
});
