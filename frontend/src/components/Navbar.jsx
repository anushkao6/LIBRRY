import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors flex items-center gap-2 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
            <span className="text-gray-900">
              LibraryHub
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              to="/books"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/books')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Books
            </Link>
            {user && (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive('/admin/dashboard') || isActive('/member/dashboard')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/about')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              About
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium hidden sm:block text-sm">
                    {user?.username || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-all hover:bg-gray-50 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

