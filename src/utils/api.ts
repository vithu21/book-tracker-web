import axios, { AxiosResponse } from 'axios';
import { Book } from '../types/book';
import { AuthResponse } from '../types/api';

const API_URL = 'https://whale-app-wl6mc.ondigitalocean.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // If it's an auth response, save the token
    if (response.config.url?.includes('/auth/login') && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const auth = {
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    console.log('Logging in with data:', data);
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(`${API_URL}/auth/login`, data);
     // Extract the data from the Axios response
      const authData = response.data;
      
      console.log('Login response:', authData);
      
      if (authData.token) {
        localStorage.setItem('token', authData.token);
        return authData;
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const token = response.data.token; // Access token from response.data
    localStorage.setItem('token', token);
    return response.data; // Return the actual response data
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const books = {
  getAll: async (): Promise<Book[]> => {
    return api.get('/books');
  },

  add: async (data: Omit<Book, '_id' | 'dateAdded'>): Promise<Book> => {
    return api.post('/books', data);
  },

  update: async (id: string, data: Partial<Book>): Promise<Book> => {
    return api.put(`/books/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/books/${id}`);
  },
};

export const reviews = {
  getBookReviews: async (bookId: string) => {
    return api.get(`/reviews/book/${bookId}`);
  },

  add: async (data: { book: string; rating: number; comment: string }) => {
    return api.post('/reviews', data);
  },

  update: async (id: string, data: { rating: number; comment: string }) => {
    return api.put(`/reviews/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/reviews/${id}`);
  },
};

export default api;