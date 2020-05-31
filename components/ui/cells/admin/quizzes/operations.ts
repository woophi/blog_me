import { callUserApi } from 'core/common';
import * as adminModels from 'core/models/admin';

export const getQuizzes = () =>
  callUserApi<adminModels.AdminQuizItem[]>('get', `api/admin/quizzes`);

export const editQuiz = (data: adminModels.AdminQuizData) =>
  callUserApi('put', 'api/admin/quiz', data);

export const createNewQuiz = (
  data: Pick<adminModels.AdminQuizData, 'title' | 'subtitle'>
) => callUserApi<{ quizId: number }>('post', 'api/admin/quiz', data);

export const deleteQuiz = (quizId: number) =>
  callUserApi('delete', 'api/admin/quiz', { quizId });

export const getQuizData = (quizId: number) =>
  callUserApi<adminModels.AdminQuizResponseData>(
    'get',
    `api/admin/quiz?quizId=${quizId}`
  );

export const updateQuestions = (questions: adminModels.SaveQuestionModel[], id: string) =>
  callUserApi<adminModels.SaveQuestionModel[]>('put', 'api/admin/quiz/questions', {
    questions,
    id
  });
