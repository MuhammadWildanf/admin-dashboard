import { create } from "zustand";
import { GetMeType, NotificationType } from "../types/auth";

type Store = {
  me: GetMeType | null;
  notification: NotificationType;
  setGetMe: (data: GetMeType | null) => void;
  setNotification: (data: NotificationType) => void;
};

export const useSession = create<Store>()((set) => ({
  me: null,
  notification: {
    new_assessment: 0,
    new_companies: 0,
  },
  setGetMe: (data) =>
    set((state) => ({
      me: data,
    })),
  setNotification: (data: NotificationType) =>
    set((state) => ({
      notification: data,
    })),
}));
