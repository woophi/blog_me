import { Server } from 'http';
import socket from 'socket.io';
import { Logger } from 'server/logger';
import * as cl from 'server/storage/cloudinary';
import { EventBus, BusEvents } from '../events';
import * as storageTypes from 'server/storage/types';
import { NameSpaces, EmitEvents } from './types';
import { verifyToken, ROLES } from 'server/identity';

export const registerSocket = (server: Server) => {
  const IO = socket(server);
  Logger.debug('Storage register events');
  cl.registerCloudinaryEvents();

  const nspBlogs = IO.of(NameSpaces.BLOGS);

  const newComment = (commentId: string, blogId: number) => {
    Logger.debug('emit comment', commentId, blogId);
    nspBlogs.to(blogId.toString()).emit(EmitEvents.new_comment, commentId);
  };

  EventBus.on(BusEvents.NEW_COMMENT, newComment);

  nspBlogs.on('connection', (socket) => {
    Logger.info('nspBlogs connected');

    socket.on('joinRoom', (blogId) => {
      if (!!blogId) {
        socket.join(blogId);
      }
      Logger.info('joined room ' + blogId);
    });

    socket.on('leaveRoom', (blogId) => {
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
  nspAdmin.use((socket, next) => {
    const token = socket.handshake.query?.token;
    const { verificaitionError, claims } = verifyToken(token);
    const isAdmin = claims.roles.some(
      (r) => r === ROLES.GODLIKE || r === ROLES.ADMIN
    );
    if (verificaitionError || !isAdmin) {
      next(new Error('Authentication error'));
    } else {
      next();
    }
  });

  nspAdmin.on('connection', (socket) => {
    Logger.debug('admin connected ' + socket.id);
    const fileSuc = ({
      fileName,
      fileId,
      url,
      format,
    }: storageTypes.FileCompleteParams) => {
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
};
