import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { SubCategoryType } from "../types/subcategory";


type Store = {
    getSubCategories: PaginationType<SubCategoryType> | null;
    setSubCategories: (data: PaginationType<SubCategoryType>) => void;
  };
  
  export const useSubCategories = create<Store>()((set) => ({
    getSubCategories: null,
    setSubCategories: (data: PaginationType<SubCategoryType>) =>
      set((state) => ({
        getSubCategories: data,
      })),
  }));
  