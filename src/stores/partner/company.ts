import { create } from "zustand";
import { PaginationType } from "../../types/pagination";
import { CompanyType } from "../../types/company";

type Store = {
  companies: PaginationType<CompanyType> | null;
  setCompanies: (data: PaginationType<CompanyType>) => void;
  company: CompanyType | null;
  setCompany: (data: CompanyType | null) => void;
};

export const useCompany = create<Store>()((set) => ({
  companies: null,
  setCompanies: (data: PaginationType<CompanyType>) =>
    set((state) => ({
      companies: data,
    })),
  company: null,
  setCompany: (data: CompanyType | null) =>
    set((state) => ({
      company: data,
    })),
}));
