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

export const QuizMain = React.memo(() => {
  const { participationHistory, subtitle, title } = useSelector(getQuizDataState);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    if (!!participationHistory?.lastStep) {
      setStarted(true);
    }
  }, [participationHistory]);

  if (!started) {
    return (
      <Box>
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
        <Button onClick={() => setStarted(true)}>start</Button>
      </Box>
    );
  }

  return <QuizSteps />;
});
