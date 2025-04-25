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
 * Fetch all alumni users
 */
export const fetchAlumni = async () => {
  try {
    const response = await axios.get('/api/users/by-role/alumni', {
      headers: authHeaders()
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch all student users
 */
export const fetchStudents = async () => {
  try {
    const response = await axios.get('/api/users/by-role/student', {
      headers: authHeaders()
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch a specific user by ID
 */
export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: authHeaders()
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export default {
  fetchAlumni,
  fetchStudents,
  fetchUserById
};