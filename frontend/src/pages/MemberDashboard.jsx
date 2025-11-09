import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  FaBook,
  FaBookOpen,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myIssues, setMyIssues] = useState([]);
  const [myFines, setMyFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'member') {
      navigate('/admin/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [issuesRes, finesRes] = await Promise.all([
        api.get('/member/issues'),
        api.get('/member/fines'),
      ]);
      
      // Ensure data is an array
      const issues = Array.isArray(issuesRes.data) ? issuesRes.data : [];
      const fines = Array.isArray(finesRes.data?.fines) ? finesRes.data.fines : 
                    Array.isArray(finesRes.data) ? finesRes.data : [];
      
      console.log('Member issues:', issues);
      console.log('Member fines:', fines);
      
      setMyIssues(issues);
      setMyFines(fines);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      toast.error(errorMsg);
      console.error('Member dashboard error:', error);
      setMyIssues([]);
      setMyFines([]);
    } finally {
      setLoading(false);
    }
  };


  const handlePayFine = async (fineId) => {
    try {
      await api.post(`/member/fines/${fineId}/pay`);
      toast.success('Fine paid successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to pay fine');
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

  const pendingFines = myFines.filter(f => f.status === 'pending');
  const totalPending = pendingFines.reduce((sum, f) => sum + f.amount, 0);
  const activeIssues = myIssues.filter(i => i.status === 'issued');

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
              <h1 className="text-4xl font-bold text-white mb-2">Member Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.username}!</p>
            </div>
            <Link
              to="/books"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaBookOpen className="text-indigo-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Books Issued</p>
            <p className="text-3xl font-bold text-white">{activeIssues.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Pending Fines</p>
            <p className="text-3xl font-bold text-white">₹{totalPending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Books Read</p>
            <p className="text-3xl font-bold text-white">{myIssues.filter(i => i.status === 'returned').length}</p>
          </motion.div>
        </div>

        {/* My Issued Books */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">My Issued Books</h2>
            <p className="text-gray-400 text-sm">Books currently in your possession</p>
          </div>
          <div className="overflow-x-auto">
            {activeIssues.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FaBook className="text-5xl mx-auto mb-4 opacity-50" />
                <p>No books currently issued</p>
                <Link
                  to="/books"
                  className="mt-4 inline-block text-indigo-400 hover:text-indigo-300"
                >
                  Browse Books →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {activeIssues.map((issue) => {
                  const bookId = issue.bookId?._id || issue.bookId;
                  const bookTitle = issue.bookId?.title || 'Unknown Book';
                  const bookAuthor = issue.bookId?.author || 'Unknown Author';
                  const coverImage = issue.bookId?.coverImage;
                  const issueDate = issue.issueDate || issue.createdAt;
                  const dueDate = issue.dueDate;
                  const isOverdue = dueDate && new Date() > new Date(dueDate);
                  
                  return (
                    <div
                      key={issue._id || issue._id?.toString()}
                      className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                    >
                      {coverImage && (
                        <img
                          src={coverImage}
                          alt={bookTitle}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-white font-semibold mb-2">{bookTitle}</h3>
                      <p className="text-gray-400 text-sm mb-3">{bookAuthor}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Issue Date:</span>
                          <span className="text-white">
                            {issueDate ? new Date(issueDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Due Date:</span>
                          <span className={isOverdue ? 'text-red-400' : 'text-white'}>
                            {dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {isOverdue && (
                          <div className="text-red-400 text-xs mb-2">
                            ⚠️ Overdue - Please return to library
                          </div>
                        )}
                      </div>
                      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 text-center">
                        <p className="text-blue-300 text-sm">
                          📚 Return this book to the library counter
                        </p>
                        <p className="text-blue-400 text-xs mt-1">
                          Admin will mark it as returned
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* My Fines */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">My Fines</h2>
            <p className="text-gray-400 text-sm">View and pay your pending fines</p>
          </div>
          <div className="overflow-x-auto">
            {myFines.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FaCheckCircle className="text-5xl mx-auto mb-4 opacity-50" />
                <p>No fines recorded</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Book</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Days Overdue</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {myFines.map((fine) => (
                    <tr key={fine._id} className="hover:bg-gray-750 transition-colors">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fine.status === 'pending' && (
                          <button
                            onClick={() => handlePayFine(fine._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                          >
                            Pay Fine
                          </button>
                        )}
                        {fine.status === 'paid' && (
                          <span className="text-gray-500 text-sm">
                            Paid on {new Date(fine.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

