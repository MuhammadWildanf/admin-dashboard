import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { PriceType } from "../types/price";

type Store = {
  GetPrice: PaginationType<PriceType> | null;
  setPrice: (data: PaginationType<PriceType>) => void;
  detail: PriceType | null;
  setDetail: (data: PriceType | null) => void;
};

export const usePrice = create<Store>()((set) => ({
  GetPrice: null,
  setPrice: (data: PaginationType<PriceType>) =>
    set((state) => ({
      GetPrice: data,
    })),
  detail: null,
  setDetail: (data: PriceType | null) =>
    set((state) => ({
      detail: data,
    })),
}));
