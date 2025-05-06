// Services/socket.js
import { io } from 'socket.io-client';
import axios from 'axios';

let socket = null;

/**
 * Initializes the Socket.IO connection and sets up global listeners.
 * Only call this once per app session (ideally from ProfileContext after auth).
 */
export const initializeSocket = (
  token,
  userId,
  {
    setHasUnreadMessages = () => {},
    activeConversationId = null,
    setMessages = () => {},
    scrollViewRef = null,
  } = {}
) => {
  if (!token || !userId) {
    console.warn('❌ Socket initialization failed: Missing token or userId');
    return;
  }

  if (socket && socket.connected) {
    console.log('⚠️ Socket already connected, skipping re-init');
    return socket;
  }

  socket = io('https://marhaba-server.onrender.com', {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('✅ Global socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.warn('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  // Message listener
  socket.on('newMessage', async (newMessage) => {
    const isActive = newMessage.conversationId === activeConversationId;

    if (isActive) {
      try {
        await axios.put('https://marhaba-server.onrender.com/api/conversation/read', {
          conversationId: activeConversationId,
          userId,
        });

        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
          scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (err) {
        console.error('❌ Error marking message as read:', err);
      }
    } else {
      setHasUnreadMessages(true);
    }
  });

  return socket;
};

export const joinConversationRoom = (conversationId) => {
  if (socket?.connected) {
    socket.emit('joinConversation', { conversationId });
    console.log(`🛜 Joined room: ${conversationId}`);
  } else {
    console.warn('⚠️ Cannot join room. Socket not connected.');
  }
};

export const leaveConversationRoom = (conversationId) => {
  if (socket?.connected) {
    socket.emit('leaveConversation', { conversationId });
    console.log(`🚪 Left room: ${conversationId}`);
  }
};

export const sendSocketMessage = (message) => {
  if (socket?.connected) {
    socket.emit('sendMessage', message);
    console.log('✉️ Sent message:', message);
  } else {
    console.warn('⚠️ Cannot send message. Socket not connected.');
  }
};

export const getSocket = () => socket;
