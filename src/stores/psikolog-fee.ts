import { create } from "zustand";
import { PsikologFeeIndexType, PsikologFeeType } from "../types/psikolog-fee";
import { PaginationType } from "../types/pagination";

type Store = {
  initials: PsikologFeeIndexType[] | null;
  setInitials: (data: PsikologFeeIndexType[]) => void;
  psikologFees: PaginationType<PsikologFeeType> | null;
  setPsikologFees: (data: PaginationType<PsikologFeeType>) => void;
};

export const usePsikologFee = create<Store>()((set) => ({
  initials: null,
  setInitials: (data: PsikologFeeIndexType[]) =>
    set(() => ({
      initials: data,
    })),
  psikologFees: null,
  setPsikologFees: (data: PaginationType<PsikologFeeType>) =>
    set(() => ({
      psikologFees: data,
    })),
}));
