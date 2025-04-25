import io from 'socket.io-client';

let socket = null;

/**
 * Initialize socket connection
 */
export const initializeSocket = (url, token) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(url, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'],
    auth: {
      token
    }
  });
  
  return socket;
};

/**
 * Join a room for a user
 */
export const joinUserRoom = (userId) => {
  if (!socket) return;
  
  socket.emit('joinRoom', { userId });
};

/**
 * Send a typing indicator
 */
export const sendTypingIndicator = (senderId, receiverId) => {
  if (!socket) return;
  
  socket.emit('typing', {
    sender: senderId,
    receiver: receiverId
  });
};

/**
 * Send a stop typing indicator
 */
export const sendStopTypingIndicator = (senderId, receiverId) => {
  if (!socket) return;
  
  socket.emit('stopTyping', {
    sender: senderId,
    receiver: receiverId
  });
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = (messageIds, userId) => {
  if (!socket) return;
  
  socket.emit('markAsRead', {
    messageIds,
    userId
  });
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (!socket) return;
  
  socket.disconnect();
  socket = null;
};

/**
 * Get the socket instance
 */
export const getSocket = () => socket;

export default {
  initializeSocket,
  joinUserRoom,
  sendTypingIndicator,
  sendStopTypingIndicator,
  markMessagesAsRead,
  disconnectSocket,
  getSocket
};