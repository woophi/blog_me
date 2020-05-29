import * as React from 'react';
import { QuizGuestData } from 'core/models';
import { useSelector } from 'react-redux';
import { getUserId } from 'core/selectors';
import { AuthButtons } from 'ui/molecules/comments/AuthButtons';
import { ModalDialog } from 'ui/atoms';

type Props = {
  quizData: QuizGuestData;
}

export const QuizLayout = React.memo<Props>(({ quizData }) => {

  const userId = useSelector(getUserId);

  if (!userId) {
    return (
      <ModalDialog
        withActions={false}
        open
        title={'Авторизуйтесь для лучших впечатлений'}
      >
        <AuthButtons />
      </ModalDialog>
    )
  }

  return null;
})