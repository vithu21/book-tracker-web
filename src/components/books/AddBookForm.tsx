
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookStore } from '../../store/bookStore';
import { BookPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export function AddBookForm() {
  const addBook = useBookStore((state) => state.addBook);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      status: 'want-to-read',
      rating: 0,
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: BookFormData) => {
    try {
      await addBook(data);
      navigate('/books');
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-8">
        <BookPlus className="w-8 h-8 text-blue-600" />
        <h2 className="ml-2 text-2xl font-bold text-gray-900">Add New Book</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="https://..."
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
              rating={rating}
              editable
              onChange={(newRating) => setValue('rating', newRating)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
}