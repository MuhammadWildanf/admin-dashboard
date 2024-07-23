import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { moduleType } from "../types/module";


type Store = {
    getModule: PaginationType<moduleType> | null;
    setModule: (data: PaginationType<moduleType>) => void;
};

export const useModule = create<Store>()((set) => ({
    getModule: null,
    setModule: (data: PaginationType<moduleType>) =>
        set((state) => ({
            getModule: data,
        })),
}));
