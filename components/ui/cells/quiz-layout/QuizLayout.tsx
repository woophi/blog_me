import * as React from 'react';
import { QuizGuestData, QuizzStatus, AppDispatchActions } from 'core/models';
import { useSelector, useDispatch } from 'react-redux';
import { getUserId, getUserFetching, getQuizDataState } from 'core/selectors';
import { AuthButtons } from 'ui/molecules/comments/AuthButtons';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { QuizMain } from './QuizMain';
import { Spinner } from 'ui/atoms/spinner';
import { ModalDialog } from 'ui/atoms/modal';

type Props = {
  quizData: QuizGuestData;
};

export const QuizLayout = React.memo<Props>(({ quizData }) => {
  const userFetching = useSelector(getUserFetching);
  const userId = useSelector(getUserId);
  const { participationHistory } = useSelector(getQuizDataState);
  const dispatch = useDispatch<AppDispatchActions>();

  React.useEffect(() => {
    dispatch({ type: 'SET_QUIZ', payload: quizData });
  }, []);

  if (userFetching) {
    return <Spinner />;
  }

  if (!userId) {
    return (
      <ModalDialog
        withActions={false}
        open
        title={'Авторизуйтесь для лучших впечатлений'}
      >
        <AuthButtons />
      </ModalDialog>
    );
  }

  if (quizData.status === QuizzStatus.Closed) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="1rem">
        <Typography variant="h1" component="h2" gutterBottom>
          Опрос закрыт.
        </Typography>
      </Box>
    );
  }

  if (participationHistory?.finished) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="1rem">
        <Typography variant="h1" component="h2" gutterBottom>
          Спасибо за участие в опросе!
        </Typography>
      </Box>
    );
  }

  return <QuizMain />;
});
