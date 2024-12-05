import { useEffect } from 'react';
import { BooksList } from '../components/books/BooksList';
import { FloatingActionButton } from '../components/books/FloatingActionButton';
import { useBookStore } from '../store/bookStore';
import { Loader } from 'lucide-react';

export function BooksPage() {
  const { loading, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Books</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <BooksList />
      )}
      <FloatingActionButton />
    </div>
  );
}