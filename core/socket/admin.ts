import io from 'socket.io-client';
import { initCallbacks } from './callbacks';

const adminNs = '/admin';

let adminConnected = false;

export const connectAdminSocket = (token: string) => {
  if (adminConnected) return;
  const socketAdmin = io(adminNs, { query: { token } });
  socketAdmin.on('connect', () => {
    console.debug('admin connected');
    initCallbacks(socketAdmin);
    adminConnected = true;
  });
}
