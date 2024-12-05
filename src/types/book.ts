export interface Book {
  _id: string; // Change from id to _id to match MongoDB
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  isbn: string;
  rating: number;
  status: 'reading' | 'completed' | 'want-to-read';
  dateAdded: string;
  dateCompleted?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
  dateCreated: string;
}