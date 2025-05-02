// services/socket.js
import { io } from 'socket.io-client';
import { useProfile } from '../Context/ProfileContext';

let socket;

export const initializeSocket = async () => {
  const {jwtToken} = useProfile();
  const token = jwjwtToken; // JWT token from login
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
