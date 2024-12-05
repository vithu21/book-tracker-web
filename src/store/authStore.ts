import { create } from 'zustand';
import { auth } from '../utils/api';
import { AuthState } from '../types/user';
import { useToastStore } from './toastStore';
import axios from 'axios';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string): Promise<void> => {
    try {
      console.log('Trying to logging in...');
      const response = await auth.login({ email, password });
      console.log('Login response:', response);

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        set({ user: response.user, isAuthenticated: true });
        useToastStore.getState().showToast('Successfully logged in!');
      } else {
        throw new Error('Login failed: Token not found in response');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API error response:', error.response?.data);
      }
      console.error('Login error:', error);
      useToastStore.getState().showToast('Login failed. Please check your credentials.', 'error');
    }
  },
  logout: () => {
    auth.logout();
    set({ user: null, isAuthenticated: false });
    useToastStore.getState().showToast('Successfully logged out!');
  },
  register: async (email: string, password: string, username: string): Promise<void> => {
    try {
      const response = await auth.register({ email, password, username });
      const { user } = response; // Destructure 'user' directly from response
      set({ user, isAuthenticated: true });
      useToastStore.getState().showToast('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      useToastStore.getState().showToast('Registration failed. Please try again.', 'error');
    }
  },
  
}));