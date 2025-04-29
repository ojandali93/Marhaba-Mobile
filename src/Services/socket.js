// services/socket.js
import { io } from 'socket.io-client';
import { getJwtToken } from './AuthStoreage'; // or however you store JWT

let socket;

export const initializeSocket = async () => {
  const token = await getJwtToken(); // JWT token from login
  socket = io('https://marhaba-server.onrender.com', {
    auth: {
      token,
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;
