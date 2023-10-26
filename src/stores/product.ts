import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { ProductPriceType, ProductType } from "../types/product";

type Store = {
  products: PaginationType<ProductType> | null;
  setProducts: (data: PaginationType<ProductType>) => void;
  product: ProductType | null;
  setProduct: (data: ProductType | null) => void;
  productPrice: PaginationType<ProductPriceType> | null;
  setProductPrice: (data: PaginationType<ProductPriceType>) => void;
};

export const useProduct = create<Store>()((set) => ({
  products: null,
  setProducts: (data: PaginationType<ProductType>) =>
    set((state) => ({
      products: data,
    })),
  product: null,
  setProduct: (data: ProductType | null) =>
    set((state) => ({
      product: data,
    })),
  productPrice: null,
  setProductPrice: (data: PaginationType<ProductPriceType>) =>
    set((state) => ({
      productPrice: data,
    })),
}));
