import io from 'socket.io-client';
import { initCallbacks } from '.';

const uniqGuestNs = '/uniq-guest';
let uniqGuestConnected = false;

export const connectUniqGuest = () => {
  if (uniqGuestConnected) return;
  const socket = io(uniqGuestNs);
  socket.on('connect', () => {
    console.debug('admin connected');
    initCallbacks(socket);
    uniqGuestConnected = true;
  });
}
