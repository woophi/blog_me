import { callUserApi } from 'core/common';
import { ParticipationAnswers } from 'core/models';

export const setNewParticipantToQuiz = (quizId: number) => {
  callUserApi('post', 'api/app/user/quiz', {
    quizId,
  });
};

