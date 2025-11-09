import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-5xl mb-6 animate-bounce-slow">📚</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Welcome to LibraryHub
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-3 leading-relaxed max-w-2xl mx-auto"
          >
            Your digital library management system
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 mb-12"
          >
            Explore, rate, and manage your favorite books
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {user ? (
              <>
                <Link
                  to="/books"
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto transform hover:-translate-y-0.5"
                >
                  Browse Books
                </Link>
                <Link
                  to="/about"
                  className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow w-full sm:w-auto"
                >
                  Learn More
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow w-full sm:w-auto"
                >
                  Create Account
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;

