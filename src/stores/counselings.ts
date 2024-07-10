import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { CounselingType } from "../types/counselings";

type Store = {
  GetCounselings: PaginationType<CounselingType> | null;
  setCounselings: (data: PaginationType<CounselingType>) => void;
};

export const useCounseling = create<Store>()((set) => ({
  GetCounselings: null,
  setCounselings: (data: PaginationType<CounselingType>) =>
    set((state) => ({
      GetCounselings: data,
    })),
}));
