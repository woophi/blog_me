import { callUserApi } from 'core/common';
import { AdminQuizData, AdminQuizItem } from 'core/models/admin';

export const getQuizzes = (offset = 0) =>
  callUserApi<AdminQuizItem[]>('get', `api/admin/quizzes`, {
    offset,
  });

export const editQuiz = (data: AdminQuizData) =>
  callUserApi('put', 'api/admin/quiz', data);

export const createNewQuiz = (data: Pick<AdminQuizData, 'title' | 'subtitle'>) =>
  callUserApi<{ quizId: number }>('post', 'api/admin/quiz', data);

export const deleteQuiz = (quizId: number) =>
  callUserApi('delete', 'api/admin/quiz', { quizId });

export const getQuizData = (quizId: number) =>
  callUserApi<AdminQuizData>('get', `api/admin/quiz?quizId=${quizId}`);
