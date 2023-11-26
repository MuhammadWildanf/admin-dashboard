import { create } from "zustand";
import { PaginationType } from "../../types/pagination";
import { UserPsikologType } from "../../types/users";

type Store = {
  userPsikologs: PaginationType<UserPsikologType> | null;
  setUserPsikologs: (data: PaginationType<UserPsikologType>) => void;
};

export const useUserPsikolog = create<Store>()((set) => ({
  userPsikologs: null,
  setUserPsikologs: (data: PaginationType<UserPsikologType>) =>
    set((state) => ({
      userPsikologs: data,
    })),
}));
