import io from 'socket.io-client';
import { initCallbacks } from '.';

let socketQuizConnected = false;

let socketQuiz: SocketIOClient.Socket;

const quizNs = '/quiz';

export const connectSocketQuiz = (token: string) => {
  if (socketQuizConnected) return;
  socketQuiz = io(quizNs, { query: { token } });
  socketQuiz.on('connect', () => {
    console.debug('client socketQuiz connected');
    initCallbacks(socketQuiz);
    socketQuizConnected = true;
  });
};

export const joinQuizRoom = (quizId: number, userId: string) => {
  socketQuiz.emit('joinQuizRoom', quizId + userId);
};
export const leaveQuizRoom = (quizId: number, userId: string) => {
  socketQuiz.emit('leaveQuizRoom', quizId + userId);
};
