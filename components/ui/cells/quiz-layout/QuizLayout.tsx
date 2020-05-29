import * as React from 'react';
import { QuizGuestData, QuizzStatus, AppDispatchActions } from 'core/models';
import { useSelector, useDispatch } from 'react-redux';
import { getUserId, getUserFetching } from 'core/selectors';
import { AuthButtons } from 'ui/molecules/comments/AuthButtons';
import { ModalDialog, Spinner } from 'ui/atoms';
import Box from '@material-ui/core/Box';
import { QuizMain } from './QuizMain';

type Props = {
  quizData: QuizGuestData;
};

export const QuizLayout = React.memo<Props>(({ quizData }) => {
  const userFetching = useSelector(getUserFetching);
  const userId = useSelector(getUserId);
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
    return <Box>Quiz ended</Box>;
  }

  if (quizData.participationHistory?.finished) {
    return <Box>Вы уже завершили этот quiz</Box>;
  }

  return <QuizMain />;
});
