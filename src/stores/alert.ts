import { create } from "zustand";

type Store = {
  type: "error" | "info" | "success" | undefined;
  message: string | undefined;
  setMessage: (
    message: string | undefined,
    type: "error" | "info" | "success" | undefined
  ) => void;
};

export const useAlert = create<Store>()((set) => ({
  type: undefined,
  message: undefined,
  setMessage: (
    message: string | undefined,
    type: "error" | "info" | "success" | undefined
  ) =>
    set((state) => ({
      message: message,
      type: type,
    })),
}));
