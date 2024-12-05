import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book } from '../../types/book';
import { X } from 'lucide-react';
import { StarRating } from './StarRating';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverUrl: z.string().url('Must be a valid URL'),
  status: z.enum(['reading', 'completed', 'want-to-read']),
  rating: z.number().min(0).max(5),
});

type BookFormData = z.infer<typeof bookSchema>;

interface EditBookModalProps {
  book: Book;
  onClose: () => void;
  onSave: (bookData: Partial<Book>) => void;
}

export function EditBookModal({ book, onClose, onSave }: EditBookModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      coverUrl: book.coverUrl,
      status: book.status,
      rating: book.rating,
    },
  });

  const handleFormSubmit = async (data: BookFormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Book</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                {...register('author')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ISBN</label>
              <input
                type="text"
                {...register('isbn')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover URL</label>
              <input
                type="url"
                {...register('coverUrl')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.coverUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.coverUrl.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <StarRating
                rating={book.rating}
                editable
                onChange={(rating) => setValue('rating', rating)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}