import { create } from "zustand";

interface IPopup {
  popup: boolean;
  onPopup: () => void;
  popup2: boolean;
  onPopup2: () => void;
  popup3: boolean;
  onPopup3: () => void;
  popup4: boolean;
  onPopup4: () => void;
  closePop: () => void;
}

export const usePopupStore = create<IPopup>((set) => ({
  popup: false,
  onPopup: () =>
    set((state) => ({
      popup: !state.popup,
      popup2: false,
      popup3: false,
      popup4: false,
    })),
  popup2: false,
  onPopup2: () =>
    set((state) => ({
      popup: false,
      popup2: !state.popup2,
      popup3: false,
      popup4: false,
    })),
  popup3: false,
  onPopup3: () =>
    set((state) => ({
      popup: false,
      popup2: false,
      popup3: !state.popup3,
      popup4: false,
    })),
  popup4: false,
  onPopup4: () =>
    set((state) => ({
      popup: false,
      popup2: false,
      popup3: false,
      popup4: !state.popup4,
    })),
  closePop: () =>
    set({ popup: false, popup2: false, popup3: false, popup4: false }),
}));