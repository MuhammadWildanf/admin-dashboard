import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { ArticleType } from "../types/articles";

type Store = {
    GetArticles: PaginationType<ArticleType> | null;
    setArticles: (data: PaginationType<ArticleType>) => void;
  };
  
  export const useArticles = create<Store>()((set) => ({
    GetArticles: null,
    setArticles: (data: PaginationType<ArticleType>) =>
      set((state) => ({
        GetArticles: data,
      })),
  }));
  