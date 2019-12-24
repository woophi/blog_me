import * as React from 'react';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { AppState } from 'core/models';
import { BlogSearchPreview } from 'ui/molecules/blog-search-result';

type OwnProps = {
  show: boolean;
};

const mapState = (state: AppState, _: OwnProps) => ({
  searchResults: state.ui.searchResults
});

type Props = ReturnType<typeof mapState> & OwnProps;

const SearchResultsPC = React.memo<Props>(({ show, searchResults }) => {
  const { boxBg } = useStyles({});
  return (
    <Fade in={show}>
      <Box
        width="100%"
        height="100vh"
        position="absolute"
        zIndex={3}
        className={boxBg}
      >
        {searchResults.length ? (
          searchResults.map(b => <BlogSearchPreview blog={b} key={b.blogId} />)
        ) : (
          <Box display="flex" justifyContent="center" margin="1rem">
            {'Здесь могли быть результаты'}
          </Box>
        )}
      </Box>
    </Fade>
  );
});

export const SearchResults = connect(mapState)(SearchResultsPC);

const useStyles = makeStyles(theme => ({
  boxBg: {
    backgroundColor: theme.palette.background.paper
  }
}));
