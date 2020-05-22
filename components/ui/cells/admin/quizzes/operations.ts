import { callUserApi } from 'core/common';
import * as adminModels from 'core/models/admin';

export const getQuizzes = (offset = 0) =>
  callUserApi<adminModels.AdminQuizItem[]>('get', `api/admin/quizzes`, {
    offset,
  });

export const editQuiz = (data: adminModels.AdminQuizData) =>
  callUserApi('put', 'api/admin/quiz', data);

export const updateQuizWithQuestions = (quizId: number, questionIds: string[]) =>
  callUserApi('patch', 'api/admin/quiz', {
    quizId,
    questionIds,
  });

export const createNewQuiz = (
  data: Pick<adminModels.AdminQuizData, 'title' | 'subtitle'>
) => callUserApi<{ quizId: number }>('post', 'api/admin/quiz', data);

export const deleteQuiz = (quizId: number) =>
  callUserApi('delete', 'api/admin/quiz', { quizId });

export const getQuizData = (quizId: number) =>
  callUserApi<adminModels.AdminQuizData>('get', `api/admin/quiz?quizId=${quizId}`);

export const createQuestions = (data: adminModels.CreateQuestionModel) =>
  callUserApi('post', 'api/admin/quiz/questions', data);

export const updateQuestions = (data: adminModels.UpdateQuestionModel) =>
  callUserApi('put', 'api/admin/quiz/questions', data);

export const getQuestions = () =>
  callUserApi<adminModels.QuestionData[]>('get', 'api/admin/quiz/questions');

export const getQuestion = (id: string) =>
  callUserApi<adminModels.QuestionData>('get', `api/admin/quiz/question?id=${id}`);
