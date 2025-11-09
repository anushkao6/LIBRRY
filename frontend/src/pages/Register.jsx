import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { checkBackendConnection } from '../utils/connectionCheck';
import { toast } from 'react-toastify';
import { FaBook, FaSpinner, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member', // 'member' or 'admin'
    paymentMethod: 'cash',
    paymentDetails: {},
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  const MEMBER_FEE = 200;

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method,
      paymentDetails: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Member registration requires payment
    if (formData.role === 'member' && !formData.paymentMethod) {
      setError('Member registration requires payment. Please select a payment method.');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'member' ? formData.paymentMethod : null,
        formData.role === 'member' ? formData.paymentDetails : null
      );
      
      if (result.success) {
        toast.success(formData.role === 'member' 
          ? `Registration successful! Member fee of ₹${MEMBER_FEE} processed.`
          : 'Admin registration successful! (Free)'
        );
        // Navigate based on role
        if (result.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/member/dashboard');
        }
      } else {
        const errorMsg = result.message || 'Registration failed';
        setError(errorMsg);
        toast.error(errorMsg);
        // Show specific message for admin already exists
        if (errorMsg.includes('Admin user already exists')) {
          setError('Admin account already exists. Only one admin is allowed. Please register as a member instead.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
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
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join LibraryHub today</p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Register as
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'member', paymentMethod: 'cash' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'member'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold mb-1">Member</div>
                  <div className="text-xs">₹{MEMBER_FEE} Registration Fee</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin', paymentMethod: null })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'admin'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold mb-1">Admin</div>
                  <div className="text-xs">Free Registration</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Member Payment Section */}
            {formData.role === 'member' && (
              <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-yellow-300 font-semibold">Member Registration Fee</div>
                    <div className="text-yellow-400 text-sm">One-time payment of ₹{MEMBER_FEE}</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-300">₹{MEMBER_FEE}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('cash')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.paymentMethod === 'cash'
                          ? 'border-indigo-500 bg-indigo-500/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <FaMoneyBillWave className="text-xl mx-auto mb-1" />
                      <span className="text-xs">Cash</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('upi')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.paymentMethod === 'upi'
                          ? 'border-indigo-500 bg-indigo-500/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <FaMobileAlt className="text-xl mx-auto mb-1" />
                      <span className="text-xs">UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('card')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-indigo-500 bg-indigo-500/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <FaCreditCard className="text-xl mx-auto mb-1" />
                      <span className="text-xs">Card</span>
                    </button>
                  </div>
                </div>

                {formData.paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={formData.paymentDetails.upiId || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentDetails: { ...formData.paymentDetails, upiId: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                      placeholder="yourname@upi"
                    />
                  </div>
                )}

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.paymentDetails.cardNumber || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentDetails: { ...formData.paymentDetails, cardNumber: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={formData.paymentDetails.expiry || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            paymentDetails: { ...formData.paymentDetails, expiry: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.paymentDetails.cvv || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            paymentDetails: { ...formData.paymentDetails, cvv: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

               
              </div>
            )}

            {/* Admin Free Notice */}
            {formData.role === 'admin' && (
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-300">
                  <span className="text-xl">✓</span>
                  <div>
                    <div className="font-semibold">Admin Registration </div>
                  
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || checkingConnection || error.includes('Cannot connect')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating account...
                </>
              ) : formData.role === 'admin' ? (
                'Create Admin Account (Free)'
              ) : (
                `Create Member Account (₹${MEMBER_FEE})`
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                Sign in instead
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

export default Register;

