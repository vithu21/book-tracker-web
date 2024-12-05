import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Navbar } from './components/layout/Navbar';
import { AddBookForm } from './components/books/AddBookForm';
import { BooksPage } from './pages/BooksPage';
import { Toast } from './components/ui/Toast';
import { useToastStore } from './store/toastStore';
import { useAuthStore } from './store/authStore';

function App() {
  const { message, type, hideToast } = useToastStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/books" /> :
              <div className="flex justify-center items-center mt-10">
                <LoginForm />
              </div>
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/books" /> :
              <div className="flex justify-center items-center mt-10">
                <RegisterForm />
              </div>
            } />
            <Route path="/books" element={
              !isAuthenticated ? <Navigate to="/login" /> : <BooksPage />
            } />
            <Route path="/books/add" element={
              !isAuthenticated ? <Navigate to="/login" /> :
              <div className="flex justify-center items-center mt-10">
                <AddBookForm />
              </div>
            } />
            <Route path="/" element={
              <div className="text-center mt-10">
                <h1 className="text-4xl font-bold text-gray-900">Welcome to BookTracker</h1>
                <p className="mt-4 text-xl text-gray-600">
                  Track your reading journey, discover new books, and connect with fellow readers.
                </p>
              </div>
            } />
          </Routes>
        </main>
        {message && (
          <Toast
            message={message}
            type={type}
            onClose={hideToast}
          />
        )}
      </div>
    </Router>
  );
}

export default App;