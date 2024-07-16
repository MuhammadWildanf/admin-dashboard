import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { CounselingProductType } from "../types/counselingProduct";

type Store = {
  GetcounselingProduct: PaginationType<CounselingProductType> | null;
  setCounselingProduct: (data: PaginationType<CounselingProductType>) => void;
  detail: CounselingProductType | null;
  setDetail: (data: CounselingProductType | null) => void;
};

export const useCounselingProduct = create<Store>()((set) => ({
  GetcounselingProduct: null,
  setCounselingProduct: (data: PaginationType<CounselingProductType>) =>
    set((state) => ({
      GetcounselingProduct: data,
    })),
  detail: null,
  setDetail: (data: CounselingProductType | null) =>
    set((state) => ({
      detail: data,
    })),
}));
