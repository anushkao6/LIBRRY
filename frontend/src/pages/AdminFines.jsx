import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaRupeeSign, FaCheckCircle, FaClock, FaBook } from 'react-icons/fa';

const AdminFines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, paid

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    fetchFines();
  }, [user, navigate]);

  const fetchFines = async () => {
    try {
      const res = await api.get('/fines');
      setFines(res.data);
    } catch (error) {
      toast.error('Failed to load fines');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (fineId) => {
    try {
      await api.put(`/fines/${fineId}/pay`);
      toast.success('Fine marked as paid');
      fetchFines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update fine');
    }
  };

  const filteredFines = fines.filter((fine) => {
    if (filter === 'pending') return fine.status === 'pending';
    if (filter === 'paid') return fine.status === 'paid';
    return true;
  });

  const totalPending = fines.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fines.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-500"></div>
          <p className="text-gray-400 mt-4">Loading fines...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-white mb-2">Fine Management</h1>
              <p className="text-gray-400">Manage library fines and payments</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Fines</p>
                <p className="text-2xl font-bold text-white">
                  ₹{totalPending + totalPaid}
                </p>
              </div>
              <FaRupeeSign className="text-indigo-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending Fines</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ₹{totalPending}
                </p>
              </div>
              <FaClock className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Paid Fines</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{totalPaid}
                </p>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'paid'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Paid
          </button>
        </div>

        {/* Fines Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFines.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      No fines found
                    </td>
                  </tr>
                ) : (
                  filteredFines.map((fine) => (
                    <tr key={fine._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {fine.userId?.username || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {fine.userId?.email || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaBook className="text-indigo-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-white">
                              {fine.bookId?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {fine.bookId?.author || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          ₹{fine.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {fine.daysOverdue} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            fine.status === 'paid'
                              ? 'bg-green-900/30 text-green-300 border border-green-500'
                              : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500'
                          }`}
                        >
                          {fine.status === 'paid' ? (
                            <>
                              <FaCheckCircle className="mr-1" /> Paid
                            </>
                          ) : (
                            <>
                              <FaClock className="mr-1" /> Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {fine.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(fine._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                          >
                            Mark as Paid
                          </button>
                        )}
                        {fine.status === 'paid' && (
                          <span className="text-gray-500 text-sm">
                            Paid on {new Date(fine.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFines;

