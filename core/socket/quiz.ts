import io from 'socket.io-client';
import { initCallbacks } from '.';

let socketQuizConnected = false;

let socketQuiz: SocketIOClient.Socket;

const quizNs = '/quiz';

export const connectSocketQuiz = () => {
  if (socketQuizConnected) return;
  socketQuiz = io(quizNs);
  socketQuiz.on('connect', () => {
    console.debug('client socketQuiz connected');
    initCallbacks(socketQuiz);
    socketQuizConnected = true;
  });
}

export const joinRoom = (quizId: string) => {
  socketQuiz.emit('joinRoom', quizId)
}
export const leaveRoom = (quizId: string) => {
  socketQuiz.emit('leaveRoom', quizId)
}
