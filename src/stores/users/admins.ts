import { create } from "zustand";
import { PaginationType } from "../../types/pagination";
import { UserAdminType } from "../../types/users";

type Store = {
  userAdmins: PaginationType<UserAdminType> | null;
  setUserAdmins: (data: PaginationType<UserAdminType>) => void;
  detail: UserAdminType | null;
  setDetail: (data: UserAdminType | null) => void;
};

export const useUserAdmin = create<Store>()((set) => ({
  userAdmins: null,
  setUserAdmins: (data: PaginationType<UserAdminType>) =>
    set((state) => ({
      userAdmins: data,
    })),
  detail: null,
  setDetail: (data: UserAdminType | null) =>
    set((state) => ({
      detail: data,
    })),
}));
