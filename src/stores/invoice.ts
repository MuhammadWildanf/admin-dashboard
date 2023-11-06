import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { SellingsType } from "../types/asesmen";
import { InvoiceType } from "../types/invoice";

type Store = {
  sellings: PaginationType<SellingsType> | null;
  setSellings: (data: PaginationType<SellingsType>) => void;
  invoices: PaginationType<InvoiceType> | null;
  setInvoices: (data: PaginationType<InvoiceType>) => void;
  invoice: InvoiceType | null;
  setInvoice: (data: InvoiceType) => void;
};

export const useInvoice = create<Store>()((set) => ({
  sellings: null,
  setSellings: (data: PaginationType<SellingsType>) =>
    set((state) => ({
      sellings: data,
    })),
  invoices: null,
  setInvoices: (data: PaginationType<InvoiceType>) =>
    set((state) => ({
      invoices: data,
    })),
  invoice: null,
  setInvoice: (data: InvoiceType) =>
    set((state) => ({
      invoice: data,
    })),
}));
