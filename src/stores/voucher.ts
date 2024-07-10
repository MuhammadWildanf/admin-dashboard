import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { VoucherType } from "../types/vouchers";


type Store = {
    getVouchers: PaginationType<VoucherType> | null;
    setVouchers: (data: PaginationType<VoucherType>) => void;
  };
  
  export const useVoucher = create<Store>((set) => ({
    getVouchers: null,
    setVouchers: (data: PaginationType<VoucherType>) =>
      set((state) => ({
        getVouchers: data,
      })),
  }));