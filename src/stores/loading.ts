import { create } from "zustand";

type Store = {
  loading: boolean;
  setLoading: (open: boolean) => void;
};

export const useLoading = create<Store>()((set) => ({
  loading: false,
  setLoading: (data: boolean) =>
    set((state) => ({
      loading: data,
    })),
}));
