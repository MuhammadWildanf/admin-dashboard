import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import {
  ActivationCodeDetailType,
  ActivationCodeType,
} from "../types/activation-code";

type Store = {
  activationCodes: PaginationType<ActivationCodeType> | null;
  setActivationCode: (data: PaginationType<ActivationCodeType>) => void;
  detail: ActivationCodeDetailType | null;
  setDetail: (data: ActivationCodeDetailType | null) => void;
};

export const useActivationCode = create<Store>()((set) => ({
  activationCodes: null,
  setActivationCode: (data: PaginationType<ActivationCodeType>) =>
    set((state) => ({
      activationCodes: data,
    })),
  detail: null,
  setDetail: (data: ActivationCodeDetailType | null) =>
    set((state) => ({
      detail: data,
    })),
}));
