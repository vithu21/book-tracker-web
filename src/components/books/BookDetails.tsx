import React, { useState, useEffect } from 'react';
import { Book } from '../../types/book';
import { StarRating } from './StarRating';
import { reviews } from '../../utils/api';
import { useToastStore } from '../../store/toastStore';
import { MessageSquare, Send, X } from 'lucide-react';

interface BookDetailsProps {
  book: Book;
  onClose: () => void;
}

interface Review {
  _id: string;
  user: {
    username: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export function BookDetails({ book, onClose }: BookDetailsProps) {
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    fetchReviews();
  }, [book._id]);

  useEffect(() => {
    console.log('Current book reviews:', bookReviews);
  }, [bookReviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching reviews for book ID:', book._id);
      const response = await reviews.getBookReviews(book._id);
      console.log('Reviews response:', response);

      if (Array.isArray(response)) {
        setBookReviews(response);
        console.log('Book reviews set:', response);
      } else {
        console.error('Unexpected response format:', response);
        showToast('Failed to fetch reviews', 'error');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast('Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim() || newReview.rating === 0) {
      showToast('Please provide both rating and comment', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await reviews.add({
        book: book._id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      });
      showToast('Review added successfully!');
      setNewReview({ rating: 0, comment: '' });
      await fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      showToast('Failed to add review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Reviews for {book.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : Array.isArray(bookReviews) && bookReviews.length > 0 ? (
              <div className="space-y-6">
                {bookReviews.map((review) => (
                  <div key={review._id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0">
                        {review.user.avatar ? (
                          <img
                            src={review.user.avatar}
                            alt={review.user.username}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {review.user.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {review.user.username}
                        </p>
                        <div className="flex items-center">
                          <StarRating rating={review.rating} size={16} />
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <StarRating
                rating={newReview.rating}
                editable
                onChange={(rating) => setNewReview({ ...newReview, rating })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Share your thoughts about this book..."
                disabled={submitting}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}