import { goToSpecific } from 'core/common';

export const openBlog = (title: string, blogId: number) => {
  const mapTitle = title.toLowerCase().split(' ').join('-');
  goToSpecific(`/post/${mapTitle}-${blogId}`);
};

export const openQuiz = (quizId: number) => {
  goToSpecific(`/quiz/${quizId}`);
};