// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Connect to the main backend server which has Socket.IO
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
  }
  return socket;
};

export const joinAuctionRoom = (auctionId: string) => {
  const socket = getSocket();
  socket.emit('joinAuction', auctionId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
