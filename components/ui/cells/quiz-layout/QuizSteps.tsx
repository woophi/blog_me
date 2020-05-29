import * as React from 'react';
import { useSelector } from 'react-redux';
import { getQuizDataState } from 'core/selectors';
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

export const QuizSteps = React.memo(() => {
  const { questions, participationHistory } = useSelector(getQuizDataState);

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(
    participationHistory?.lastStep ?? 0
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {questions.map((questionObj, index) => (
          <Step key={questionObj.id}>
            <StepLabel>{questionObj.step}</StepLabel>
            <StepContent>
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
              </Box>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === questions.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
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
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);
