import { Server } from 'http';
import socket from 'socket.io';
import { Logger } from 'server/logger';
import * as cl from 'server/storage/cloudinary';
import { EventBus, BusEvents } from '../events';
import * as storageTypes from 'server/storage/types';
import { NameSpaces, EmitEvents } from './types';
import { registerAgendaEvents } from '../agenda';
import { verifyToken } from 'server/identity';

export const registerSocket = (server: Server) => {
  const IO = socket(server);
  Logger.debug('Storage register events');
  cl.registerCloudinaryEvents();
  registerAgendaEvents();

  const nspBlogs = IO.of(NameSpaces.BLOGS);

  const newComment = (commentId: string, blogId: number) => {
    Logger.debug('emit comment', commentId, blogId);
    nspBlogs.to(blogId.toString()).emit(EmitEvents.new_comment, commentId);
  };

  EventBus.on(BusEvents.NEW_COMMENT, newComment);

  nspBlogs.on('connection', socket => {
    Logger.info('nspBlogs connected');

    socket.on('joinRoom', blogId => {
      if (!!blogId) {
        socket.join(blogId);
      }
      Logger.info('joined room ' + blogId);
    });

    socket.on('leaveRoom', blogId => {
      if (!!blogId) {
        socket.leave(blogId);
      }
      Logger.info('left room ' + blogId);
    });

    socket.on('disconnect', () => {
      Logger.info('nspBlogs disconnected');
      socket.leaveAll();
    });
  });

  const nspAdmin = IO.of(NameSpaces.ADMIN);
  nspAdmin.on('connection', socket => {
    Logger.debug('admin connected ' + socket.id);
    const fileSuc = ({ fileName, fileId, url, format }: storageTypes.FileCompleteParams) => {
      socket.emit(EmitEvents.upload_done, fileName, fileId, url, format);
    };

    const fileErr = ({ fileName }: storageTypes.FileCompleteParams) => {
      socket.emit(EmitEvents.upload_error, fileName);
    };

    socket.on('disconnect', () => {
      Logger.info('admin disconnected');
      EventBus.removeListener(
        storageTypes.FStorageEvents.UPLOADED_FILE_SUCCESS,
        fileSuc
      );
      EventBus.removeListener(
        storageTypes.FStorageEvents.UPLOADED_FILE_ERROR,
        fileErr
      );
    });

    EventBus.on(storageTypes.FStorageEvents.UPLOADED_FILE_SUCCESS, fileSuc);
    EventBus.on(storageTypes.FStorageEvents.UPLOADED_FILE_ERROR, fileErr);
  });

  const nspQuiz = IO.of(NameSpaces.QUIZ);
  nspQuiz.use((socket, next) => {
    const token = socket.handshake.query?.token;
    const { verificaitionError } = verifyToken(token);
    if (verificaitionError) {
      next(new Error('Authentication error'));
    } else {
      next();
    }
  });

  nspQuiz.on('connection', async socket => {
    Logger.info('nspQuiz connected');
    const token = socket.handshake.query?.token;

    socket.on('joinQuizRoom', quizRoomId => {
      socket.join(quizRoomId);
      Logger.info('joined quiz room', quizRoomId);
    });

    socket.on('leaveQuizRoom', quizRoomId => {
      socket.leave(quizRoomId);
      Logger.info('left quiz room', quizRoomId);
    });

    socket.on('disconnect', () => {
      Logger.info('nspQuiz disconnected');
      socket.leaveAll();
      Logger.info(JSON.stringify(socket.rooms), 'socket rooms')
    });
  });

};
