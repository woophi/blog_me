import * as React from 'react';
import { ProfileLike } from 'core/models';
import { getUserLikes } from 'core/operations/profile';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Like } from 'ui/molecules/likes';
import { openBlog } from './actions';

export const UserLikes = React.memo(() => {
  const [likes, setLikes] = React.useState<ProfileLike[]>([]);
  React.useEffect(() => {
    getUserLikes().then(setLikes);
  }, []);

  if (!likes.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom="1rem"
      >
        <Box>
          <Typography color="secondary">
            Вы пока не оставили ни одного лайка
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      {likes.map((l, i) => (
        <Box key={i}>
          <Box
            display="flex"
            justifyContent="center"
            marginBottom="1rem"
            flexWrap="wrap"
            alignItems="center"
          >
            <Box>
              <Like blogId={l.blog.blogId} />
            </Box>
            <Box marginRight="1rem">
              <Typography color="secondary">Блог: {l.blog.title}</Typography>
            </Box>
            <Button
              color="primary"
              variant="contained"
              onClick={() => openBlog(l.blog.title, l.blog.blogId)}
            >
              Перейти к блогу
            </Button>
          </Box>
        </Box>
      ))}
    </>
  );
});
