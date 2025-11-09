import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { checkBackendConnection } from '../utils/connectionCheck';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    setCheckingConnection(true);
    const result = await checkBackendConnection();
    if (!result.connected) {
      setError(result.message);
    } else {
      setError('');
    }
    setCheckingConnection(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login form error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-10 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
          >
            ×
          </button>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {checkingConnection && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                Checking backend connection...
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg"
              >
                <div className="font-semibold mb-1">⚠️ Connection Issue</div>
                <div className="text-sm">{error}</div>
                <button
                  type="button"
                  onClick={checkConnection}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Check Again
                </button>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || checkingConnection || error.includes('Cannot connect')}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : checkingConnection ? 'Checking connection...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-gray-900 hover:text-gray-700 font-medium hover:underline"
            >
              Create one now
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;

