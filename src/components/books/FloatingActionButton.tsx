import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/books/add')}
      className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      aria-label="Add new book"
    >
      <PlusCircle className="h-6 w-6" />
    </button>
  );
}