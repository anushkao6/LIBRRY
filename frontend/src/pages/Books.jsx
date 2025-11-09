import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import BookCard from '../components/BookCard';
import AddBookModal from '../components/AddBookModal';
import PaymentModal from '../components/PaymentModal';

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedCategory, books]);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      if (res.data) {
        setBooks(res.data);
        setFilteredBooks(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query) ||
          book.category?.toLowerCase().includes(query) ||
          book.isbn?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (book) => book.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredBooks(filtered);
  };

  const handleBookAdded = () => {
    fetchBooks();
  };

  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Our Library
            </h1>
            <p className="text-gray-600 text-base">Discover and explore our collection</p>
          </motion.div>
          
          {user && (
            <div className="flex flex-wrap gap-3">
              {user && user.role === 'admin' && (
                <button
                  onClick={() => setShowAddBook(true)}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
                >
                  <span>+</span> Add Book
                </button>
              )}
              <button
                onClick={() => setShowPayment(true)}
                className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 text-sm"
              >
                Payment
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, category, or ISBN..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
              />
            </div>
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
          {searchQuery && (
            <p className="text-gray-600 text-sm">
              Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-gray-900"></div>
            <p className="text-gray-600 text-lg mt-4">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="text-5xl mb-4">📖</div>
            <p className="text-gray-900 text-xl mb-2 font-medium">No books available yet</p>
            {user && (
              <p className="text-gray-500">Be the first to add a book to our library!</p>
            )}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-900 text-xl mb-2 font-medium">No books found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.filter(book => book && book._id).map((book, index) => (
              <motion.div
                key={book._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <BookCard book={book} onUpdate={fetchBooks} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddBookModal
        isOpen={showAddBook}
        onClose={() => setShowAddBook(false)}
        onBookAdded={handleBookAdded}
      />
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </div>
  );
};

export default Books;

