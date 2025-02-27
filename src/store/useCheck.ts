import { create } from 'zustand';

interface IuseCheck {
  checks: boolean;
  onCheck: () => void;
  offCheck: () => void;
}

export const useCheckboxStore = create<IuseCheck>((set) => ({
  checks: true,
  onCheck: () => set({ checks: false }),
  offCheck: () => set({ checks: true }),
}));
