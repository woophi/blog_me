import * as React from 'react';
import { useSelector } from 'react-redux';
import { getQuizDataState, getUserId, getUserToken } from 'core/selectors';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'ui/molecules/quill-editor/quill.css';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { TextField } from 'ui/atoms';
import { QuizQuestionType } from 'core/models';
import { joinQuizRoom, connectSocketQuiz, leaveQuizRoom } from 'core/socket/quiz';

export const QuizSteps = React.memo(() => {
  const { questions, participationHistory, quizId } = useSelector(getQuizDataState);
  const userId = useSelector(getUserId);
  const token = useSelector(getUserToken);

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(
    participationHistory?.lastStep - 1 || 0
  );

  React.useEffect(() => {
    if (quizId && userId) {
      connectSocketQuiz(token);
      joinQuizRoom(quizId, userId);
    }
  }, [quizId, userId, token]);

  React.useEffect(() => {
    return () => {
      if (quizId && userId) {
        leaveQuizRoom(quizId, userId);
      }
    };
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        className={classes.steperContent}
      >
        {questions.map((questionObj, index) => (
          <Step key={questionObj.id}>
            <StepLabel>Вопрос № {questionObj.step}</StepLabel>
            <StepContent className={classes.stepContent}>
              <Box minWidth="50vw" padding="1rem" maxWidth="720px">
                <Typography component="div" gutterBottom>
                  <div className="quill ">
                    <div className="ql-snow">
                      <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: questionObj.question }}
                      />
                    </div>
                  </div>
                </Typography>
                {questionObj.type !== QuizQuestionType.NOTE && (
                  <TextField
                    placeholder="Ваш ответ"
                    type="textarea"
                    multiline
                    className={classes.answerInput}
                  />
                )}
              </Box>
              <div className={classes.actionsContainer}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === questions.length - 1 ? 'Окончить опрос' : 'Далее'}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === questions.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
        </Paper>
      )}
    </div>
  );
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    steperContent: {
      backgroundColor: 'transparent',
    },
    stepContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    answerInput: {
      margin: '0',
      padding: '1rem',
      width: '85%',
    },
  })
);
