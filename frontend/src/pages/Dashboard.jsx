import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaBook,
  FaUsers,
  FaBookOpen,
  FaClock,
  FaRupeeSign,
  FaExclamationTriangle,
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setDashboardData(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-500"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, charts } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Library management overview and analytics</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaUsers className="mr-1" />
                Manage Users
              </button>
              <button
                onClick={() => navigate('/admin/fines')}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaRupeeSign className="mr-1" />
                Manage Fines
              </button>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaBook className="text-indigo-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Books</p>
            <p className="text-3xl font-bold text-white">{overview.totalBooks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-purple-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Members</p>
            <p className="text-3xl font-bold text-white">{overview.totalMembers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaBookOpen className="text-pink-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Issued Books</p>
            <p className="text-3xl font-bold text-white">{overview.issuedBooks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaClock className="text-yellow-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Pending Returns</p>
            <p className="text-3xl font-bold text-white">{overview.pendingReturns}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaRupeeSign className="text-green-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Fines Collected</p>
            <p className="text-3xl font-bold text-white">₹{overview.totalFinesCollected}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Pending Fines</p>
            <p className="text-3xl font-bold text-white">₹{overview.totalFinesPending}</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Books by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Books by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.booksByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id || 'Uncategorized'}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {charts.booksByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Recent Issues (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.recentIssues}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Issues"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Popular Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Popular Books</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {charts.popularBooks.map((book, index) => (
              <div
                key={book._id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <img
                  src={book.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover'}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h4 className="text-white font-semibold text-sm mb-1 truncate">
                  {book.title}
                </h4>
                <p className="text-gray-400 text-xs mb-2">{book.author}</p>
                <p className="text-indigo-400 text-xs">
                  Issued {book.issueCount} times
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Payments */}
        {charts.monthlyPayments && charts.monthlyPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.monthlyPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="total" fill="#6366f1" name="Revenue (₹)" />
                <Bar dataKey="count" fill="#8b5cf6" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

