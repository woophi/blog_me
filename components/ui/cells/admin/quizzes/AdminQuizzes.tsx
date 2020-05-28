import * as React from 'react';
import { LinkButton } from 'ui/atoms/Links';
import Box from '@material-ui/core/Box';
import { AdminQuizItem } from 'core/models/admin';
import { getQuizzes } from './operations';
import { QuizzesList } from './List';

export const AdminQuzzies = React.memo(() => {
  const [allQuizzes, setQuzzies] = React.useState<AdminQuizItem[]>([]);
  React.useEffect(() => {
    getQuizzes().then(setQuzzies);
  }, []);

  return (
    <>
      <Box flexDirection="column" flex={1}>
        <LinkButton
          href="/admin/create/quiz"
          color="primary"
          variant="contained"
          label="Создать новый quiz"
          style={{
            marginLeft: 16,
          }}
        />
        <QuizzesList quzzies={allQuizzes} />
      </Box>
    </>
  );
});
