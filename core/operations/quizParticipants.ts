import { callUserApi } from 'core/common';
import { ParticipationHistory, ParticipationAnswers } from 'core/models';

export const getQuizParticipantionInfo = (quizId: number) =>
  callUserApi<ParticipationHistory>(
    'get',
    `api/app/user/quiz/participation?quizId=${quizId}`
  );

export const patchQuizAnswers = (quizId: number, answers: ParticipationAnswers) =>
  callUserApi('patch', 'api/app/user/quiz/answers', {
    quizId,
    answers,
  });
