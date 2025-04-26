import API from './api';

export const signup = async (userData) => {
  try {
    const response = await API.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    // Call your backend logout endpoint if you have one
    const response = await API.post('/logout');
    return response.data;
  } catch (error) {
    // Even if the API call fails, we should still clear client-side auth
    console.error('Logout error:', error);
    throw error;
  }
};