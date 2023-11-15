import { create } from "zustand";
import { TaxJournalType, TaxType } from "../types/tax";
import { PaginationType } from "../types/pagination";

type Store = {
  taxes: PaginationType<TaxType> | null;
  setTaxes: (data: PaginationType<TaxType>) => void;
  tax: TaxType | null;
  setTax: (data: TaxType | null) => void;
  journalTaxes: PaginationType<TaxJournalType> | null;
  setJournalTaxes: (data: PaginationType<TaxJournalType>) => void;
};

export const useTax = create<Store>()((set) => ({
  taxes: null,
  setTaxes: (data: PaginationType<TaxType>) =>
    set((state) => ({
      taxes: data,
    })),
  tax: null,
  setTax: (data: TaxType | null) =>
    set((state) => ({
      tax: data,
    })),
  journalTaxes: null,
  setJournalTaxes: (data: PaginationType<TaxJournalType>) =>
    set((state) => ({
      journalTaxes: data,
    })),
}));
