import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network/connection errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please check your connection.';
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        error.message = 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000';
      }
    }
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && error.config?.url !== '/auth/me') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on home page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

