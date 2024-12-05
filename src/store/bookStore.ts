import { create } from 'zustand';
import { Book } from '../types/book';
import { books } from '../utils/api';
import { useToastStore } from './toastStore';

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, '_id' | 'dateAdded'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  loading: false,
  error: null,
  fetchBooks: async () => {
    try {
      set({ loading: true, error: null });
      const fetchedBooks = await books.getAll();
      set({ books: fetchedBooks });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch books';
      set({ error: errorMessage });
      useToastStore.getState().showToast(errorMessage, 'error');
    } finally {
      set({ loading: false });
    }
  },
  addBook: async (bookData) => {
    try {
      set({ loading: true, error: null });
      const newBook = await books.add(bookData);
      set((state) => ({ books: [...state.books, newBook] }));
      useToastStore.getState().showToast('Book added successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add book';
      set({ error: errorMessage });
      useToastStore.getState().showToast(errorMessage, 'error');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateBook: async (id, bookData) => {
    try {
      set({ loading: true, error: null });
      const updatedBook = await books.update(id, bookData);
      set((state) => ({
        books: state.books.map((book) =>
          book._id === id ? { ...book, ...updatedBook } : book
        ),
      }));
      useToastStore.getState().showToast('Book updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update book';
      set({ error: errorMessage });
      useToastStore.getState().showToast(errorMessage, 'error');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteBook: async (id) => {
    try {
      set({ loading: true, error: null });
      await books.delete(id);
      set((state) => ({
        books: state.books.filter((book) => book._id !== id),
      }));
      useToastStore.getState().showToast('Book deleted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete book';
      set({ error: errorMessage });
      useToastStore.getState().showToast(errorMessage, 'error');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));