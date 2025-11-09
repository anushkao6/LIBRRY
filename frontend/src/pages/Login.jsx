import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { checkBackendConnection } from '../utils/connectionCheck';
import { toast } from 'react-toastify';
import { FaBook, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    }
    checkConnection();
  }, [user, navigate]);

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
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        // Navigate based on role
        if (result.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/member/dashboard');
        }
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <FaBook className="text-6xl text-indigo-500" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Connection Check */}
          {checkingConnection && (
            <div className="mb-6 bg-blue-900/30 border border-blue-500/50 text-blue-300 px-4 py-3 rounded-lg flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              <span className="text-sm">Checking backend connection...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg"
            >
              <div className="font-semibold mb-1">⚠️ {error.includes('Connection') ? 'Connection Issue' : 'Error'}</div>
              <div className="text-sm">{error}</div>
              {error.includes('Cannot connect') && (
                <button
                  onClick={checkConnection}
                  className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                  Check Again
                </button>
              )}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || checkingConnection || error.includes('Cannot connect')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                Create one now
              </Link>
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-gray-500 hover:text-gray-400 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

