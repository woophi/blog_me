import * as React from 'react';
import Box from '@material-ui/core/Box';
import { AdminQuizParticipantData } from 'core/models/admin';
import { getQuizParticipantsData } from './operations';
import Typography from '@material-ui/core/Typography';

type Props = {
  quizId: number;
};

export const AdminQuzParticipants = React.memo<Props>(({ quizId }) => {
  const [participants, setParticipants] = React.useState<AdminQuizParticipantData[]>(
    []
  );

  React.useEffect(() => {
    if (quizId) {
      getQuizParticipantsData(quizId).then(setParticipants);
    }
  }, [quizId]);

  return (
    <>
      <Box flexDirection="column" flex={1}>
        {participants.map((p, i) => (
          <Box key={p.userId} display="flex" flexDirection="column" margin="1rem">
            <Box padding=".25rem">
              <Typography color="secondary">Участник опроса № {i + 1}</Typography>
            </Box>
            <Box padding=".25rem">{p.userName}</Box>
            <Box padding=".25rem" display="flex">
              <Typography color="secondary">{'Finished: '}</Typography>
              <Box marginLeft=".25rem">
                {p.finished ? 'quiz finished' : 'quiz not finished'}
              </Box>
            </Box>
            <Box padding=".25rem" display="flex">
              <Typography color="secondary">{'Last step: '}</Typography>
              <Box marginLeft=".25rem">{p.lastStep}</Box>
            </Box>
            <Box padding=".25rem" display="flex">
              <Typography color="secondary">{'Answers: '}</Typography>
              <Box marginLeft=".25rem">
                {Object.keys(p.answers ?? {}).map((objKey) => (
                  <Box key={objKey} display="flex" flexDirection="column">
                    <Box padding=".25rem" display="flex">
                      <Typography color="secondary">{'Номер вопроса: '}</Typography>
                      <Box marginLeft=".25rem">{objKey}</Box>
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
                                    p.questions.find(
                                      (q) => q.step === Number(objKey)
                                    )?.question ?? '',
                                }}
                              />
                            </div>
                          </div>
                        </Typography>
                      </Box>
                    </Box>
                    <Box padding=".25rem" display="flex">
                      <Typography color="secondary">{'Ответ: '}</Typography>
                      <Box marginLeft=".25rem">{p.answers[objKey]}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
});
