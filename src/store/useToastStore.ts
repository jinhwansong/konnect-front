import { create } from 'zustand';

interface IToast {
  message: string;
  type: 'success' | 'error';
}

interface IToastStore {
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
  toast: IToast | null;
}

export const useToastStore = create<IToastStore>((set) => ({
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    // 3초후 자동 숨기기
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },
  hideToast: () => set({ toast: null }),
}));
