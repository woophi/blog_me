import * as React from 'react';
import { useSelector } from 'react-redux';
import { getQuizDataState } from 'core/selectors';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import 'ui/molecules/quill-editor/quill.css';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { QuizSteps } from './QuizSteps';
import { setNewParticipantToQuiz } from './operations';

export const QuizMain = React.memo(() => {
  const { participationHistory, subtitle, title, quizId } = useSelector(
    getQuizDataState
  );
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    if (!!participationHistory?.lastStep && !participationHistory?.finished) {
      setStarted(true);
    }
  }, [participationHistory]);

  const handleStartQuiz = React.useCallback(() => {
    setStarted(true);
    setNewParticipantToQuiz(quizId);
  }, [quizId]);

  if (participationHistory?.finished) {
    return null;
  }

  if (!started) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box minWidth="50vw" padding="1rem" maxWidth="720px">
          <Typography component="div" gutterBottom>
            <div className="quill ">
              <div className="ql-snow">
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              </div>
            </div>
          </Typography>
        </Box>
        <Box minWidth="50vw" padding="1rem" maxWidth="720px">
          <Typography component="div" gutterBottom>
            <div className="quill ">
              <div className="ql-snow">
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />
              </div>
            </div>
          </Typography>
        </Box>
        <Button color="primary" variant="contained" onClick={handleStartQuiz}>
          Начать опрос
        </Button>
      </Box>
    );
  }

  return <QuizSteps />;
});
