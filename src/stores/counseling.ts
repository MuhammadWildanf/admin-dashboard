import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { Counseling } from "../types/counseling";

type Store = {
    counseling: PaginationType<Counseling> | null;
    setCounseling: (data: PaginationType<Counseling>) => void;
    detail: Counseling | null;
    setDetail: (data: Counseling | null) => void;
  };
  
  export const useCounseling = create<Store>()((set) => ({
    counseling: null,
    setCounseling: (data: PaginationType<Counseling>) =>
      set((state) => ({
        counseling: data,
      })),
    detail: null,
    setDetail: (data: Counseling | null) =>
      set((state) => ({
        detail: data,
      })),
  }));