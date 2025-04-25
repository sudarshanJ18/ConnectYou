import axios from 'axios';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Headers with authorization token
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`
});

// Error handler
const handleError = (error) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

/**
 * Fetch chats for a student user
 */
export const fetchStudentChats = async (userId) => {
  try {
    const response = await axios.get(`/api/chat/student-chats/${userId}`, {
      headers: authHeaders()
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch chats for an alumni user
 */
export const fetchAlumniChats = async () => {
  try {
    const response = await axios.get('/api/chat/alumni-chats', {
      headers: authHeaders()
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch messages for a specific conversation
 */
export const fetchMessages = async (senderId, receiverId) => {
  try {
    const response = await axios.get('/api/chat/get-messages', {
      headers: authHeaders(),
      params: {
        sender: senderId,
        receiver: receiverId
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Send a message
 */
export const sendMessage = async (senderId, receiverId, content) => {
  try {
    const response = await axios.post('/api/chat/send-message', {
      sender: senderId,
      receiver: receiverId,
      content
    }, {
      headers: authHeaders()
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export default {
  fetchStudentChats,
  fetchAlumniChats,
  fetchMessages,
  sendMessage
};