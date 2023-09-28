import { create } from "zustand";
import { GetMeType } from "../types/auth";

type Store = {
  me: GetMeType | null;
  setGetMe: (data: GetMeType | null) => void;
};

export const useSession = create<Store>()((set) => ({
  me: null,
  setGetMe: (data) =>
    set((state) => ({
      me: data,
    })),
}));
