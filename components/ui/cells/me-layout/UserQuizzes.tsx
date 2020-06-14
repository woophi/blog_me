import * as React from 'react';
import { ProfileQuiz } from 'core/models';
import { getUserQuizzes } from 'core/operations/profile';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { openQuiz } from './actions';

export const UserQuizzes = React.memo(() => {
  const [quizzes, setQuizzes] = React.useState<ProfileQuiz[]>([]);

  React.useEffect(() => {
    getUserQuizzes().then(setQuizzes);
  }, []);

  return (
    <Box flexDirection="column" flex={1}>
      {quizzes.map((q, i) => (
        <Box key={q.quizId} display="flex" flexDirection="column" margin="1rem">
          <Box padding=".25rem" display="flex" alignItems="center">
            <Typography color="secondary">Опрос:</Typography>
            <Box marginLeft=".25rem">
              <Typography color="textPrimary">{q.quizName}</Typography>
            </Box>
          </Box>
          <Box padding=".25rem" display="flex" alignItems="center">
            <Typography color="secondary">{'Состояние: '}</Typography>
            <Box marginLeft=".25rem" display="flex" alignItems="center">
              <Typography color="textPrimary">
                {q.finished ? 'Вы завершили опрос' : 'Вы не завершили опрос'}
              </Typography>
              {!q.finished && (
                <Box marginLeft="1rem">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => openQuiz(q.quizId)}
                  >
                    Закончить опрос
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          <Box padding=".25rem" display="flex">
            <Typography color="secondary">{'Последний вопрос: '}</Typography>
            <Box marginLeft=".25rem">
              <Typography color="textPrimary">{q.lastStep}</Typography>
            </Box>
          </Box>
          <Box padding=".25rem" display="flex">
            <Typography color="secondary">{'Ваши ответы: '}</Typography>
            <Box marginLeft=".25rem">
              {Object.keys(q.answers).map((objKey) => (
                <Box key={objKey} display="flex" flexDirection="column">
                  <Box padding=".25rem" display="flex">
                    <Typography color="secondary">{'Номер вопроса: '}</Typography>
                    <Box marginLeft=".25rem">
                      <Typography color="textPrimary">{objKey}</Typography>
                    </Box>
                  </Box>
                  <Box padding=".25rem" display="flex">
                    <Typography color="secondary">{'Вопрос: '}</Typography>
                    <Box minWidth="50vw" padding="1rem" maxWidth="720px">
                      <Typography component="div" gutterBottom>
                        <div className="quill ">
                          <div className="ql-snow">
                            <div
                              className="ql-editor"
                              dangerouslySetInnerHTML={{
                                __html:
                                  q.questions.find((q) => q.step === Number(objKey))
                                    ?.question ?? '',
                              }}
                            />
                          </div>
                        </div>
                      </Typography>
                    </Box>
                  </Box>
                  <Box padding=".25rem" display="flex">
                    <Typography color="secondary">{'Ответ: '}</Typography>
                    <Box marginLeft=".25rem">
                      <Typography color="textPrimary">
                        {q.answers[objKey]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
});
