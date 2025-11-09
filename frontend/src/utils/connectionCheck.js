import api from './api';

/**
 * Check if backend server is running and accessible
 * @returns {Promise<{connected: boolean, message: string}>}
 */
export const checkBackendConnection = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    if (response && response.data && response.data.status === 'ok') {
      return {
        connected: true,
        message: 'Backend server is running',
      };
    }
    return {
      connected: false,
      message: 'Backend server responded but with unexpected data',
    };
  } catch (error) {
    const errorCode = error?.code || '';
    const errorMessage = error?.message || 'Unknown error';
    
    if (errorCode === 'ERR_NETWORK' || errorMessage === 'Network Error' || errorMessage.includes('Network')) {
      return {
        connected: false,
        message: 'Cannot connect to backend server. Please make sure the backend is running on http://localhost:5000',
      };
    }
    if (errorCode === 'ECONNABORTED') {
      return {
        connected: false,
        message: 'Connection timeout. Backend server may be slow or not responding.',
      };
    }
    return {
      connected: false,
      message: String(errorMessage) || 'Unknown connection error',
    };
  }
};

export default checkBackendConnection;

