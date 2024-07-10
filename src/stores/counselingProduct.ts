import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { CounselingProductType } from "../types/counselingProduct";

type Store = {
  GetcounselingProduct: PaginationType<CounselingProductType> | null;
  setCounselingProduct: (data: PaginationType<CounselingProductType>) => void;
};

export const useCounselingProduct = create<Store>()((set) => ({
  GetcounselingProduct: null,
  setCounselingProduct: (data: PaginationType<CounselingProductType>) =>
    set((state) => ({
      GetcounselingProduct: data,
    })),
}));
