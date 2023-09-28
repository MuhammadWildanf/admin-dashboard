import { create } from "zustand";

type Store = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useMenu = create<Store>()((set) => ({
  open: false,
  setOpen: (data: boolean) =>
    set((state) => ({
      open: data,
    })),
}));
