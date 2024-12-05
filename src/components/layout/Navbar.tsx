import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BookTracker</span>
            </Link>
            
            {user && (
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/books"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Books
                </Link>
                <Link
                  to="/discover"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Discover
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.username}</span>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
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
}