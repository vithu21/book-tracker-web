import { useState } from 'react';
import { useBookStore } from '../../store/bookStore';
import { Book as BookIcon } from 'lucide-react';
import { BookCard } from './BookCard';
import { EditBookModal } from './EditBookModal';
import { Book } from '../../types/book';

export function BooksList() {
  const { books, updateBook } = useBookStore();
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleEditBook = async (bookData: Partial<Book>) => {
    if (!editingBook) return;
    
    try {
      await updateBook(editingBook._id, bookData); // Use _id instead of id
      setEditingBook(null);
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new book to your collection.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard
            key={book._id} // Use _id instead of id
            book={book}
            onEdit={() => setEditingBook(book)}
          />
        ))}
      </div>

      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleEditBook}
        />
      )}
    </>
  );
}