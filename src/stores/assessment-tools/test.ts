import { create } from "zustand";
import { TestType } from "../../types/assessment-tools/test";
import { PaginationType } from "../../types/pagination";

type Store = {
  testTools: PaginationType<TestType> | null;
  setTestTools: (data: PaginationType<TestType>) => void;
};

export const useTestTools = create<Store>()((set) => ({
  testTools: null,
  setTestTools: (data: PaginationType<TestType>) =>
    set((state) => ({
      testTools: data,
    })),
}));
