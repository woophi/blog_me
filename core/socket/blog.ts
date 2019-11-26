import io from 'socket.io-client';
import { initCallbacks } from '.';

let socketBlogConnected = false;

let socketBlog: SocketIOClient.Socket;

const blogsNs = '/blogs';

export const connectSocketBlog = () => {
  if (socketBlogConnected) return;
  socketBlog = io(blogsNs);
  socketBlog.on('connect', () => {
    console.debug('client socketBlog connected');
    initCallbacks(socketBlog);
    socketBlogConnected = true;
  });
}

export const joinRoom = (blogId: string) => {
  socketBlog.emit('joinRoom', blogId)
}
export const leaveRoom = (blogId: string) => {
  socketBlog.emit('leaveRoom', blogId)
}
