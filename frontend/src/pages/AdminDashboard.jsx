import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  FaBook,
  FaUsers,
  FaBookOpen,
  FaClock,
  FaRupeeSign,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    coverImage: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/member/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data) {
        setDashboardData(res.data);
      } else {
        toast.error('No data received from server');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      toast.error(errorMsg);
      console.error('Dashboard error:', error);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/books', newBook);
      toast.success('Book added successfully!');
      setShowAddBook(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        coverImage: '',
        description: '',
        category: '',
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.delete(`/admin/books/${bookId}`);
      toast.success('Book deleted successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

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

  const { stats = {}, issuedBooks = [], fines = [] } = dashboardData || {};
  
  // Ensure stats has all required fields with defaults
  const safeStats = {
    totalMembers: stats.totalMembers || 0,
    totalBooks: stats.totalBooks || 0,
    totalIssuedBooks: stats.totalIssuedBooks || 0,
    totalPendingFines: stats.totalPendingFines || 0,
    totalFinesCollected: stats.totalFinesCollected || 0,
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Library management overview</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddBook(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Add Book
              </button>
              <Link
                to="/books"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                View All Books
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-purple-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Members</p>
            <p className="text-3xl font-bold text-white">{safeStats.totalMembers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaBook className="text-indigo-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Books</p>
            <p className="text-3xl font-bold text-white">{safeStats.totalBooks}</p>
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
            <p className="text-gray-400 text-sm mb-1">Total Books Issued</p>
            <p className="text-3xl font-bold text-white">{safeStats.totalIssuedBooks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Pending Fines</p>
            <p className="text-3xl font-bold text-white">₹{safeStats.totalPendingFines}</p>
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
            <p className="text-3xl font-bold text-white">₹{safeStats.totalFinesCollected}</p>
          </motion.div>
        </div>

        {/* Issued Books Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Who Issued Books</h2>
            <p className="text-gray-400 text-sm">View all members who have issued books</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Book</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Issue Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {issuedBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      No books currently issued
                    </td>
                  </tr>
                ) : (
                  issuedBooks.map((issue) => (
                    <tr key={issue._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{issue.userId?.username || 'N/A'}</div>
                        <div className="text-sm text-gray-400">{issue.userId?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{issue.bookId?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-400">{issue.bookId?.author || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-300 border border-blue-500">
                          {issue.status || 'issued'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {issue.status === 'issued' && (
                          <button
                            onClick={async () => {
                              try {
                                const response = await api.put(`/admin/issues/${issue._id}/return`);
                                toast.success(response.data?.message || 'Book marked as returned');
                                fetchDashboardData();
                              } catch (error) {
                                console.error('Mark as returned error:', error);
                                const errorMsg = error.response?.data?.message || error.message || 'Failed to mark as returned';
                                toast.error(errorMsg);
                              }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                          >
                            Mark as Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Fines Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Pending Fines</h2>
            <p className="text-gray-400 text-sm">Members with unpaid fines</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Book</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Days Overdue</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {fines.filter(f => f.status === 'pending').length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No pending fines
                    </td>
                  </tr>
                ) : (
                  fines.filter(f => f.status === 'pending').map((fine) => (
                    <tr key={fine._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{fine.userId?.username}</div>
                        <div className="text-sm text-gray-400">{fine.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{fine.bookId?.title}</div>
                        <div className="text-sm text-gray-400">{fine.bookId?.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-yellow-400">₹{fine.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {fine.daysOverdue} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={async () => {
                            try {
                              await api.put(`/fines/${fine._id}/pay`);
                              toast.success('Fine marked as paid');
                              fetchDashboardData();
                            } catch (error) {
                              toast.error('Failed to update fine');
                            }
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                        >
                          Mark as Paid
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Fines Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">All Fines</h2>
            <p className="text-gray-400 text-sm">View all fines (pending and paid)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Book</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Days Overdue</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {fines.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No fines recorded
                    </td>
                  </tr>
                ) : (
                  fines.map((fine) => (
                    <tr key={fine._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{fine.userId?.username}</div>
                        <div className="text-sm text-gray-400">{fine.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{fine.bookId?.title}</div>
                        <div className="text-sm text-gray-400">{fine.bookId?.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">₹{fine.amount}</div>
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
                          {fine.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Add New Book</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author *</label>
                <input
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ISBN</label>
                <input
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={newBook.coverImage}
                  onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBook(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

