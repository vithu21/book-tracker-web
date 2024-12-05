import { useState } from 'react';
import { Book } from '../../types/book';
import { StarRating } from './StarRating';
import { Edit2, Trash2, Eye, MessageSquare } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import { BookDetails } from './BookDetails';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
}

export function BookCard({ book, onEdit }: BookCardProps) {
  const deleteBook = useBookStore((state) => state.deleteBook);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setIsDeleting(true);
        await deleteBook(book._id);
      } catch (error) {
        console.error('Failed to delete book:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const fallbackImage = `https://via.placeholder.com/400x600.png?text=${encodeURIComponent(book.title)}`;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={imageError ? fallbackImage : book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          
          <div className="mb-2">
            <StarRating rating={book.rating || 0} />
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
              book.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {book.status.replace('-', ' ')}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDetails(true)}
                className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="View book details"
              >
                <MessageSquare size={18} /> 
              </button>
              <button
                onClick={() => onEdit(book)}
                className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Edit book"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-1 text-gray-600 hover:text-red-600 transition-colors ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Delete book"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <BookDetails book={book} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}