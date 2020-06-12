import * as React from 'react';
import { Comment } from 'ui/molecules/comments/Comment';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { goToSpecific } from 'core/common';
import { AppDispatchActions } from 'core/models';
import { useSelector, useDispatch } from 'react-redux';
import * as sel from 'core/selectors';
import { getUserComments, commentsToDict } from 'core/operations/profile';

export const UserComments = React.memo(() => {
  const comments = useSelector(sel.getUserComments);
  const dispatch = useDispatch<AppDispatchActions>();

  React.useEffect(() => {
    getUserComments().then((coms) => {
      dispatch({
        type: 'UPDATE_USER_PROFILE_COMMENTS',
        payload: commentsToDict(coms),
      });
    });
  }, []);

  const handleClick = React.useCallback((title: string, blogId: number) => {
    const mapTitle = title.toLowerCase().split(' ').join('-');
    goToSpecific(`/post/${mapTitle}-${blogId}`);
  }, []);

  if (!Object.values(comments).length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom="1rem"
      >
        <Box>
          <Typography color="secondary">
            Вы пока не оставили ни одного комментария
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div>
      {Object.values(comments).map((uc, i) => (
        <Box key={i}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginBottom="1rem"
          >
            <Box>
              <Typography color="secondary">Блог: {uc.blogTitle}</Typography>
            </Box>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleClick(uc.blogTitle, uc.blogId)}
            >
              Перейти к блогу
            </Button>
          </Box>
          {uc.comments.map((c, i) => (
            <Comment {...c} key={i} />
          ))}
        </Box>
      ))}
    </div>
  );
});
