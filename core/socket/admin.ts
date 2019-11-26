import io from 'socket.io-client';
import { initCallbacks } from '.';

const adminNs = '/admin';

let adminConnected = false;

export const connectAdminSocket = () => {
  if (adminConnected) return;
  const socketAdmin = io(adminNs);
  socketAdmin.on('connect', () => {
    console.debug('admin connected');
    initCallbacks(socketAdmin);
    adminConnected = true;
  });
}
