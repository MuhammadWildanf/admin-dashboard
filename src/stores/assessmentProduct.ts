import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { assessmentProductType } from "../types/assessmentProduct";


type Store = {
    getassessmentProduct: PaginationType<assessmentProductType> | null;
    setassessmentProduct: (data: PaginationType<assessmentProductType>) => void;
};

export const useAssessmentProduct = create<Store>()((set) => ({
    getassessmentProduct: null,
    setassessmentProduct: (data: PaginationType<assessmentProductType>) =>
        set((state) => ({
            getassessmentProduct: data,
        })),
}));
