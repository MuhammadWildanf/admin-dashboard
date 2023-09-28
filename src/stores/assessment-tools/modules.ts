import { create } from "zustand";
import { TestType } from "../../types/assessment-tools/test";
import { PaginationType } from "../../types/pagination";
import { ModuleType } from "../../types/assessment-tools/module";

type Store = {
  modules: PaginationType<ModuleType> | null;
  setModules: (data: PaginationType<ModuleType>) => void;
};

export const useTestModules = create<Store>()((set) => ({
  modules: null,
  setModules: (data: PaginationType<ModuleType>) =>
    set((state) => ({
      modules: data,
    })),
}));
