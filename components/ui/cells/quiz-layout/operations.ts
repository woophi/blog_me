import { callUserApi } from 'core/common';

export const setNewParticipantToQuiz = (quizId: number) => {
  callUserApi('post', 'api/app/user/quiz', {
    quizId,
  });
};

