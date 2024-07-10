import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { CategoryType } from "../types/category";


type Store = {
    getCategories: PaginationType<CategoryType> | null;
    setCategories: (data: PaginationType<CategoryType>) => void;
  };
  
  export const useCategories = create<Store>()((set) => ({
    getCategories: null,
    setCategories: (data: PaginationType<CategoryType>) =>
      set((state) => ({
        getCategories: data,
      })),
  }));
  