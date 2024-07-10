import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { WebinarType } from "../types/webinar";

type Store = {
    webinars: PaginationType<WebinarType> | null;
    setWebinars: (data: PaginationType<WebinarType>) => void;
};

export const useWebinar = create<Store>()((set) => ({
    webinars: null,
    setWebinars: (data: PaginationType<WebinarType>) =>
        set((state) => ({
            webinars: data,
        })),
}));