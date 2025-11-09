import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaBookOpen } from 'react-icons/fa';

const BookCard = ({ book, onUpdate }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isIssued, setIsIssued] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'member') {
      checkIfIssued();
    }
  }, [user, book._id]);

  const checkIfIssued = async () => {
    try {
      const res = await api.get('/member/issues');
      if (res.data && Array.isArray(res.data)) {
        const issued = res.data.some(
          (issue) => {
            const bookId = issue.bookId?._id || issue.bookId;
            return (bookId === book._id || bookId?.toString() === book._id?.toString()) && issue.status === 'issued';
          }
        );
        setIsIssued(issued);
      }
    } catch (error) {
      console.error('Failed to check issue status:', error);
      setIsIssued(false);
    }
  };

  if (!book) return null;

  const userRating = book.ratings?.find((r) => {
    try {
      const ratingUserId = typeof r.userId === 'object' ? r.userId.toString() : r.userId;
      const currentUserId = user?._id?.toString();
      return ratingUserId === currentUserId;
    } catch (error) {
      return false;
    }
  });
  const averageRating = book.averageRating || 0;
  const totalRatings = book.ratings?.length || 0;

  const handleRating = async (newRating) => {
    if (!user) return;
    setLoading(true);
    try {
      await api.put(`/books/${book._id}/rate`, { rating: newRating });
      setRating(newRating);
      onUpdate();
      toast.success('Rating updated!');
    } catch (error) {
      toast.error('Failed to update rating');
      console.error('Failed to rate book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async () => {
    if (!user) {
      toast.error('Please login to issue books');
      return;
    }
    setIssueLoading(true);
    try {
      const res = await api.post('/member/issue', { bookId: book._id });
      if (res.data && res.data.issue) {
        setIsIssued(true);
        onUpdate();
        toast.success('Book issued successfully!');
      } else {
        toast.success('Book issued successfully!');
        setIsIssued(true);
        onUpdate();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to issue book';
      toast.error(errorMsg);
      console.error('Issue book error:', error);
    } finally {
      setIssueLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 group">
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <img
          src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
        
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= parseFloat(averageRating)
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {averageRating || '0.0'} ({totalRatings})
          </span>
        </div>

        {user && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">Your Rating:</p>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  disabled={loading}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-base transition-colors ${
                    star <= (hoverRating || userRating?.rating || 0)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  } hover:text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              book.availability
                ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                : 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
            }`}
          >
            {book.availability ? '✓ Available' : '✗ Unavailable'}
          </span>
          {book.category && (
            <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
              {book.category}
            </span>
          )}
        </div>

        {user && user.role === 'member' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {isIssued ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  📚 Issued - Return to library
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Admin will mark as returned
                </p>
              </div>
            ) : (
              <button
                onClick={handleIssue}
                disabled={issueLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <FaBookOpen />
                {issueLoading ? 'Issuing...' : 'Issue Book'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;

