import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { VoucherType } from "../types/vouchers";


type Store = {
  getVouchers: PaginationType<VoucherType> | null;
  setVouchers: (data: PaginationType<VoucherType>) => void;
  detail: VoucherType | null;
  setDetail: (data: VoucherType | null) => void;
};

export const useVoucher = create<Store>((set) => ({
  getVouchers: null,
  setVouchers: (data: PaginationType<VoucherType>) =>
    set((state) => ({
      getVouchers: data,
    })),
  detail: null,
  setDetail: (data: VoucherType | null) =>
    set((state) => ({
      detail: data,
    })),
}));