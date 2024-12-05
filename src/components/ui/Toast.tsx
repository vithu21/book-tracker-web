import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}