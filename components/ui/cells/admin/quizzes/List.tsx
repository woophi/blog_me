import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { InputSearch, styleTruncate } from 'ui/atoms';
import { AdminQuizItem } from 'core/models/admin';
import { goToDeep } from 'core/common';

type Props = {
  quzzies: AdminQuizItem[];
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { quzzies } = data as Props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText
        primaryTypographyProps={{ noWrap: true }}
        style={styleTruncate}
        onClick={() => goToDeep(`edit/${quzzies[index].shortId}`)}
      >
        <div dangerouslySetInnerHTML={{ __html: quzzies[index].title }} />
      </ListItemText>
    </ListItem>
  );
};

export const QuizzesList: React.FC<Props> = ({ quzzies }) => {
  const classes = useStyles({});
  const [query, search] = React.useState('');

  const getList = () =>
    quzzies.filter(
      (f) =>
        f.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        f.shortId.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
    );

  return (
    <div className={classes.root}>
      <InputSearch onChangeCb={search} value={query} />
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            itemData={{
              quzzies: getList(),
            }}
            height={height}
            width={width}
            itemSize={46}
            itemCount={getList().length}
            style={{
              overflowX: 'hidden',
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: '.5rem',
      margin: '1rem',
      height: '100%',
      minHeight: '320px'
    },
  })
);
