import {
  SortableContainer,
  SortableElement,
  SortableContainerProps,
  SortableElementProps,
} from 'react-sortable-hoc';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import { QuizQuestion } from './items/QuizQuestion';

type ItemProps = {
  itemK: any;
  tabValue: number;
  indexField: number;
  removeCb: (index: number) => void;
} & SortableElementProps;

const SortableItem = SortableElement<ItemProps>((props: ItemProps) => (
  <QuizQuestion {...props} />
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
