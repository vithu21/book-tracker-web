import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | 'info';
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  showToast: (message, type = 'success') => set({ message, type }),
  hideToast: () => set({ message: null }),
}));