import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            
            // Verify token is still valid (non-blocking)
            api.get('/auth/me')
              .then((res) => {
                if (res.data) {
                  setUser(res.data);
                  localStorage.setItem('user', JSON.stringify(res.data));
                }
                setLoading(false);
              })
              .catch((error) => {
                // Only clear if it's an auth error, not a network error
                if (error.response?.status === 401) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setUser(null);
                }
                // If network error, keep the user from localStorage
                setLoading(false);
              });
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        return { success: true, user: res.data };
      } else {
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000',
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (username, email, password, role, paymentMethod, paymentDetails) => {
    try {
      const registerData = {
        username,
        email,
        password,
        role: role || 'member',
      };

      // Add payment info for member registration (₹200)
      if (role === 'member' && paymentMethod) {
        registerData.paymentMethod = paymentMethod;
        registerData.paymentDetails = paymentDetails || {};
      }

      const res = await api.post('/auth/register', registerData);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        return { success: true, user: res.data };
      } else {
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000',
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

