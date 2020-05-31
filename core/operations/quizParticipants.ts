import { callUserApi } from 'core/common';
import { ParticipationHistory } from 'core/models';

export const getQuizParticipantionInfo = (quizId: number) =>
  callUserApi<ParticipationHistory>(
    'get',
    `api/app/user/quiz/participation?quizId=${quizId}`
  );

export const patchQuizParticipation = (quizId: number, actions: Partial<ParticipationHistory>) =>
  callUserApi('patch', 'api/app/user/quiz/participation', {
    quizId,
    actions,
  });
