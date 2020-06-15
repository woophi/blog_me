import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { selectFile, fetchFiles } from './operations';
import { connect as redux } from 'react-redux';
import { AppState } from 'core/models';
import { getSelectedFile } from 'core/selectors';
import { FileItem } from 'core/models/admin';
import { styleTruncate } from 'ui/atoms/constants';
import { Snakbars } from 'ui/atoms/Snakbars';
import { InputSearch } from 'ui/atoms/InputSearch';
import { Spinner } from 'ui/atoms/spinner';

type Props = {
  files: FileItem[];
  selectedFile: FileItem;
};

const Row = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { files, selectedFile } = data as Props;
  const handleSelect = () => selectFile(files[index]);

  return (
    <ListItem
      button
      style={style}
      key={index}
      onClick={handleSelect}
      selected={selectedFile._id === files[index]._id}
    >
      <ListItemText
        primary={files[index].name}
        primaryTypographyProps={{ noWrap: true }}
        style={styleTruncate}
        title={files[index].name}
      />
    </ListItem>
  );
};

const FilesComponent: React.FC<Props> = ({ files, selectedFile }) => {
  const classes = useStyles({});
  const [fetching, fetch] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [query, search] = React.useState('');

  React.useEffect(() => {
    fetchFiles()
      .then(() => fetch(false))
      .catch(e => {
        fetch(false);
        setError(e);
      });
  }, []);

  const getList = () =>
    files.filter(f => f.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);

  return (
    <div className={classes.root}>
      <Snakbars message={error} variant="error" />
      <InputSearch onChangeCb={search} value={query} />
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            itemData={{
              files: getList(),
              selectedFile
            }}
            height={height}
            width={width}
            itemSize={46}
            itemCount={getList().length}
            style={{
              overflowX: 'hidden'
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
      <Spinner isShow={fetching} />
    </div>
  );
};

export const FilesList = redux((state: AppState) => ({
  files: state.ui.admin.files,
  selectedFile: getSelectedFile(state)
}))(FilesComponent);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: 'calc(100% - 74px)',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    }
  })
);
