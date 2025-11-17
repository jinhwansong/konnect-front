import { create } from 'zustand';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (message, type = 'success') => {
    const id = Date.now().toString();
    const toast = { id, message, type };
    set({ toasts: [...get().toasts, toast] });

    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(item => item.id !== id),
      }));
    }, 2500);
  },
  remove: id => {
    set({ toasts: get().toasts.filter(toast => toast.id !== id) });
  },
}));
